import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  TradeOfferPriceMatrixModel,
  TradeOfferResponseModel,
  TradeOfferStockEnumModel,
  TradeOfferVatEnumModel
} from '#shared/modules/common-services/models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';
import { fromEvent } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

enum OrderStatus { NOT_AVAILABLE, TO_CART, IN_CART }

@Component({
  selector: 'my-product-order',
  templateUrl: './product-order.component.html',
  styleUrls: [
    './product-order.component.scss',
    './product-order.component-992.scss',
    './product-order.component-576.scss',
  ],
})
export class ProductOrderComponent implements OnInit, OnDestroy {

  @Input() tradeOffer: TradeOfferResponseModel;
  @ViewChild('matrixModal') ref: NzModalRef;
  orderStatus: OrderStatus;
  vat: string;
  form: FormGroup;
  isVisible = false;

  get price(): number {
    const total = this.form.get('totalPositions').value === 0 ? 1 : this.form.get('totalPositions').value;
    if (this.tradeOffer.requestedPriceProjection.matrix.length > 1) {
      // todo внимательнее проверить вычисление на ошибки!!!
      const find = this.tradeOffer.requestedPriceProjection.matrix
        .find((price, index, array) => {
          price.fromPackages && price.fromPackages >= total
          && array.find((otherPrice) => {
            price.fromPackages <= otherPrice.fromPackages;
          });
        });
      if (find) {
        return find.price / find.fromPackages * total;
      }
    }

    return this.tradeOffer.requestedPriceProjection.matrix[0].price /
      this.tradeOffer.requestedPriceProjection.matrix[0].fromPackages * total;
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
    return this.tradeOffer.requestedPriceProjection.matrix;
  }

  constructor(private _fb: FormBuilder) {
    this.form = this._fb.group({
      totalPositions: 0
    });
    this._initOrderStatus();
    this.vat = this._vat();
    this._closeModalOnResolutionChanges();
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  order() {
    this.orderStatus = OrderStatus.IN_CART;
    this.increase();
  }

  decrease() {
    this.form.patchValue({ totalPositions: this.form.get('totalPositions').value - 1 });
    if (this.form.get('totalPositions').value === 0) {
      this.orderStatus = OrderStatus.TO_CART;
    }
  }

  increase() {
    this.form.patchValue({ totalPositions: this.form.get('totalPositions').value + 1 });
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

  private _vat() {
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

  private _initOrderStatus() {
    if (this.tradeOffer?.termsOfSale?.temporarilyOutOfSales ||
      this.tradeOffer?.stock?.stockBalanceSummary?.level === TradeOfferStockEnumModel.OUT_OF_STOCK) {
      this.orderStatus = OrderStatus.NOT_AVAILABLE;
    } else {
      this.orderStatus = OrderStatus.TO_CART;
    }
  }
}
