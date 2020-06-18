import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';
import { fromEvent } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { UntilDestroy } from '@ngneat/until-destroy';
import {
  TradeOfferPriceMatrixModel,
  TradeOfferResponseModel,
  TradeOfferStockEnumModel,
  TradeOfferVatEnumModel
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
export class ProductOrderComponent {

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

  constructor(private _fb: FormBuilder) {
    this.form = this._fb.group({
      totalPositions: 0
    });
    this._initOrderStatus();
    this.vat = this._vat();
    this._closeModalOnResolutionChanges();
  }

  order() {
    this.orderStatus = OrderStatus.IN_CART;
    this.increase();
  }

  decrease() {
    this.form.patchValue({ totalPositions: this.form.get('totalPositions').value - 1 });
    if (this.form.get('totalPositions').value <= 0) {
      this.orderStatus = OrderStatus.TO_CART;
    }
  }

  increase() {
    if (this.form.get('totalPositions').value === null || this.form.get('totalPositions').value <= 0) {
      this.form.patchValue({ totalPositions: 1 });
    } else {
      this.form.patchValue({ totalPositions: this.form.get('totalPositions').value + 1 });
    }
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
