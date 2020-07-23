import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';
import { fromEvent } from 'rxjs';
import { debounceTime, filter, switchMap, map } from 'rxjs/operators';
import { UntilDestroy } from '@ngneat/until-destroy';
import {
  TradeOfferPriceMatrixModel,
  TradeOfferResponseModel,
  TradeOfferStockEnumModel,
  TradeOfferVatEnumModel,
  CartService,
  RelationEnumModel
} from '#shared/modules/common-services';

enum OrderStatus { NOT_AVAILABLE, TO_CART, IN_CART }

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'my-product-order',
  templateUrl: './product-order.component.html',
  styleUrls: [
    './product-order.component.scss',
    './product-order.component-992.scss',
    './product-order.component-576.scss',
  ],
})
export class ProductOrderComponent implements OnInit {

  @Input() tradeOffer: TradeOfferResponseModel;
  @ViewChild('matrixModal') ref: NzModalRef;
  orderStatus: OrderStatus;
  vat: string;
  form: FormGroup;
  isVisible = false;

  get price(): number {
    const total = this.form.get('totalPositions').value === null ||
    this.form.get('totalPositions').value <= 0 ? 1 : this.form.get('totalPositions').value;

    if (this.tradeOffer.requestedPriceProjection?.matrix.length === 1) {
      return this.tradeOffer.requestedPriceProjection.matrix[0].price * total;
    }

    if (this.tradeOffer.requestedPriceProjection?.matrix.length > 1) {
      if (this.matrix) {
        const findPrice = this._closest(this.matrix, total);
        return findPrice * total;
      }
    }
    return null;
  }

  get vatInfo() {
    if (this.tradeOffer?.termsOfSale.price && this.tradeOffer?.termsOfSale.price.includesVAT) {
      switch (this.tradeOffer.termsOfSale.price.vat) {
        case TradeOfferVatEnumModel.VAT_10:
          return 'Цена включает налог НДС 10%';
        case TradeOfferVatEnumModel.VAT_20:
          return 'Цена включает налог НДС 20%';
        case TradeOfferVatEnumModel.VAT_WITHOUT:
          return 'Цена не включает налог НДС';
      }
    }
    return 'Цена не включает налог НДС';
  }

  get matrix(): TradeOfferPriceMatrixModel[] {
    return this.tradeOffer.requestedPriceProjection?.matrix
      .sort((one, two) => one.fromPackages - two.fromPackages);
  }

  get cartData$() {
    return this._cartService.getCartData$();
  }

  constructor(
    private _fb: FormBuilder,
    private _cartService: CartService,
  ) {
    this.form = this._fb.group({
      totalPositions: 0
    });
  }

  ngOnInit() {
    this._initOrderStatus();
    this.vat = this._getVat();
    this._closeModalOnResolutionChanges();
    this.cartData$.subscribe((res) => {
      const tradeOfferId = this.tradeOffer.id;
      const cartTradeOffers = res.content?.reduce((accum, curr, item, ind) => {
        return [...curr.items, ...accum];
      }, []);
      const foundTradeOffer = cartTradeOffers.find((x) => {
        const hrefSplitted = x._links[RelationEnumModel.TRADEOFFER_VIEW].href.split('/');
        return hrefSplitted[hrefSplitted.length - 1] === tradeOfferId;
      });
      if (foundTradeOffer) {
        this.orderStatus = OrderStatus.IN_CART;
        this.form.patchValue({ totalPositions: foundTradeOffer.quantity });
      }
      if (!foundTradeOffer) {
        this.orderStatus = OrderStatus.TO_CART;
        this.form.patchValue({ totalPositions: null });
      }
    });
  }

  private _initOrderStatus() {
    if (this.tradeOffer?.termsOfSale.temporarilyOutOfSales ||
      this.tradeOffer?.stock?.stockBalanceSummary?.level === TradeOfferStockEnumModel.OUT_OF_STOCK) {
      this.orderStatus = OrderStatus.NOT_AVAILABLE;
    } else {
      this.orderStatus = OrderStatus.TO_CART;
    }
  }

  addToCart() {
    const cartLocation = this._cartService.getCart$().value;
    const data = {
      tradeOfferId: this.tradeOffer.id,
      quantity: 1,
    };
    this._cartService.handleRelationAndUpdateData(
      RelationEnumModel.ITEM_ADD,
      `${cartLocation}/items`,
      data,
    ).subscribe();
  }

  decrease() {
    const cartLocation = this._cartService.getCart$().value;
    const data = {
      quantity: this.form.get('totalPositions').value - 1,
    };
    if (data.quantity <= 0) {
      this._cartService.handleRelationAndUpdateData(
        RelationEnumModel.ITEM_REMOVE,
        `${cartLocation}/items/${this.tradeOffer.id}`,
      ).subscribe();
      return;
    }
    this._cartService.handleRelationAndUpdateData(
      RelationEnumModel.ITEM_UPDATE_QUANTITY,
      `${cartLocation}/items/${this.tradeOffer.id}/quantity`,
      data,
    ).subscribe();
  }

  increase() {
    const cartLocation = this._cartService.getCart$().value;
    const data = {
      quantity: this.form.get('totalPositions').value + 1,
    };
    this._cartService.handleRelationAndUpdateData(
      RelationEnumModel.ITEM_UPDATE_QUANTITY,
      `${cartLocation}/items/${this.tradeOffer.id}/quantity`,
      data,
    ).subscribe();
  }

  private _closeModalOnResolutionChanges(): void {
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(10),
        filter(() => !!this.ref)
      ).subscribe((evt: any) => {
        if (evt.target.innerWidth > 576) {
          this.ref.close();
        }
      },
      (err) => {
        console.log('error');
      }
    );
  }

  private _getVat() {
    if (this.tradeOffer?.termsOfSale.price && this.tradeOffer?.termsOfSale.price.includesVAT) {
      switch (this.tradeOffer.termsOfSale.price.vat) {
        case TradeOfferVatEnumModel.VAT_10:
          return 'НДС 10%';
        case TradeOfferVatEnumModel.VAT_20:
          return 'НДС 20%';
        case TradeOfferVatEnumModel.VAT_WITHOUT:
          return 'Без НДС';
      }
    }
    return 'Без НДС';
  }

  private _closest(matrix: TradeOfferPriceMatrixModel[], total: number): number {
    let result;
    let difference = 0;

    for (let i = 0; i < matrix.length; i++) {
      if (matrix[i].fromPackages <= total && ((total - matrix[i].fromPackages <= difference) || difference === 0)) {
        difference = total - matrix[i].fromPackages;
        result = matrix[i].price;
      }
    }

    if (!result) {
      for (let i = 0; i < matrix.length; i++) {
        if (matrix[i].fromPackages > total && ((matrix[i].fromPackages - total <= difference) || difference === 0)) {
          difference = total - matrix[i].fromPackages;
          result = matrix[i].price;
        }
      }
    }

    return result;
  }
}
