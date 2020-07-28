import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';
import { fromEvent } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { UntilDestroy } from '@ngneat/until-destroy';
import {
  OrderStatusModal,
  RelationEnumModel,
  TradeOfferPriceMatrixModel,
  TradeOfferResponseModel,
  TradeOfferStockEnumModel,
  TradeOfferVatEnumModel
} from '#shared/modules/common-services/models';
import { CartService, NotificationsService } from '#shared/modules/common-services';

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
  @ViewChild('matrixModal') modalRef: NzModalRef;
  orderStatus: OrderStatusModal;
  vat: string;
  form: FormGroup;
  isVisible = false;
  private _price: number;

  get price(): number {
    return this._price ? this._price : this._closest(this.matrix, 0);
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

  constructor(
    private _fb: FormBuilder,
    private _cartService: CartService,
    private _notificationsService: NotificationsService,
  ) {
    this.form = this._fb.group({
      totalPositions: 0
    });
  }

  ngOnInit() {
    this._initOrderStatus();
    this.vat = this._getVat();
    this._closeModalOnResolutionChanges();
    this._cartService.getCartData$()
      .subscribe(
        (res) => {
          const tradeOfferId = this.tradeOffer.id;
          const cartTradeOffers = res.content?.reduce((accum, curr, item, ind) => {
            return [...curr.items, ...accum];
          }, []);
          const foundTradeOffer = cartTradeOffers.find((x) => {
            const hrefSplitted = x._links[RelationEnumModel.TRADEOFFER_VIEW].href.split('/');
            return hrefSplitted[hrefSplitted.length - 1] === tradeOfferId;
          });
          if (foundTradeOffer) {
            this._price = foundTradeOffer.costSummary?.totalCost;
            this.orderStatus = OrderStatusModal.IN_CART;
          } else {
            this._price = null;
            this.orderStatus = OrderStatusModal.TO_CART;
          }
        },
        (err) => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        });
  }

  private _initOrderStatus() {
    if (this.tradeOffer?.termsOfSale.temporarilyOutOfSales ||
      this.tradeOffer?.stock?.stockBalanceSummary?.level === TradeOfferStockEnumModel.OUT_OF_STOCK) {
      this.orderStatus = OrderStatusModal.NOT_AVAILABLE;
    } else {
      this.orderStatus = OrderStatusModal.TO_CART;
    }
  }

  private _closeModalOnResolutionChanges(): void {
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(10),
        filter(() => !!this.modalRef)
      ).subscribe(
      (evt: any) => {
        if (evt.target.innerWidth > 576) {
          this.modalRef.close();
        }
      },
      (err) => {
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
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
