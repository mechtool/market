import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';
import { fromEvent } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { UntilDestroy } from '@ngneat/until-destroy';
import {
  OrderStatusModal,
  TradeOfferPriceMatrixModel,
  TradeOfferResponseModel,
  TradeOfferVatEnumModel
} from '#shared/modules/common-services/models';
import { CartService, NotificationsService } from '#shared/modules/common-services';
import { currencyCode } from '#shared/utils';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-product-order',
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
    return this._price ? this._price : this._closest(this.matrix);
  }

  get currencyCode(): string {
    return currencyCode(this.tradeOffer.termsOfSale.price?.currencyCode);
  }

  get vatInfo() {
    const includesVAT = this.tradeOffer?.termsOfSale.price?.includesVAT;
    switch (this.tradeOffer?.termsOfSale.price?.vat) {
      case TradeOfferVatEnumModel.VAT_10:
        return includesVAT ? 'Цена включает НДС 10%' : 'Цена не включает НДС 10%';
      case TradeOfferVatEnumModel.VAT_20:
        return includesVAT ? 'Цена включает НДС 20%' : 'Цена не включает НДС 20%';
      case TradeOfferVatEnumModel.VAT_WITHOUT:
        return 'Цена без НДС';
      default:
        return null;
    }
  }

  get matrix(): TradeOfferPriceMatrixModel[] {
    return this.tradeOffer.termsOfSale?.price?.matrix?.sort((one, two) => one.fromPackages - two.fromPackages) || [];
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
            return x.tradeOfferId === tradeOfferId;
          });
          if (foundTradeOffer) {
            this._price = foundTradeOffer.itemTotal?.total;
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
    const includesVAT = this.tradeOffer?.termsOfSale.price?.includesVAT;
    switch (this.tradeOffer?.termsOfSale.price?.vat) {
      case TradeOfferVatEnumModel.VAT_10:
        return includesVAT ? 'с НДС 10%' : 'без НДС 10%';
      case TradeOfferVatEnumModel.VAT_20:
        return includesVAT ? 'с НДС 20%' : 'без НДС 20%';
      case TradeOfferVatEnumModel.VAT_WITHOUT:
        return 'без НДС';
      default:
        return null;
    }
  }

  private _closest(matrix: TradeOfferPriceMatrixModel[]) {
    if (matrix?.length) {
      return matrix.sort((one, two) => one.price - two.price)[0].price;
    }
    return null;
  }
}
