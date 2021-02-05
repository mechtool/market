import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { UntilDestroy } from '@ngneat/until-destroy';
import {
  OrderStatusModal,
  TradeOfferPriceMatrixModel,
  TradeOfferResponseModel,
  TradeOfferVatEnumModel,
} from '#shared/modules/common-services/models';
import { CartService, NotificationsService } from '#shared/modules/common-services';
import { NzModalRef } from 'ng-zorro-antd/modal';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-product-order',
  templateUrl: './product-order.component.html',
  styleUrls: ['./product-order.component.scss', './product-order.component-992.scss', './product-order.component-576.scss'],
})
export class ProductOrderComponent implements OnInit {
  @Input() tradeOffer: TradeOfferResponseModel;
  @Input() isProductPage = false;
  @Output() isMadeOrder: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('matrixModal') modalRef: NzModalRef;
  orderStatus: OrderStatusModal;
  vat: string;
  form: FormGroup;
  isVisible = false;
  price: number;

  get minQuantity(): number {
    return this.matrix?.length ? this.matrix[0].fromPackages : this.tradeOffer.termsOfSale?.packageMultiplicity;
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

  constructor(private _fb: FormBuilder, private _cartService: CartService, private _notificationsService: NotificationsService) {
    this.form = this._fb.group({
      totalPositions: 0,
    });
  }

  ngOnInit() {
    this._closeModalOnResolutionChanges();
    this._cartService.getCartData$()
      .pipe(
        debounceTime(400)
      )
      .subscribe(
        (res) => {
          this.vat = this._getVat();
          const tradeOfferId = this.tradeOffer?.id;
          const cartTradeOffers = res.content?.reduce((accum, curr) => {
            return [...curr.items, ...accum];
          }, []);
          const foundTradeOffer = cartTradeOffers.find((x) => {
            return x.tradeOfferId === tradeOfferId;
          });
          if (foundTradeOffer) {
            // tslint:disable-next-line:max-line-length
            this.price = this.tradeOffer.termsOfSale.price.includesVAT ? foundTradeOffer.itemTotal?.total : foundTradeOffer.itemTotal?.totalWithoutVat;
            this.orderStatus = OrderStatusModal.IN_CART;
          } else {
            this.price = null;
            this.orderStatus = OrderStatusModal.TO_CART;
          }
        },
        (err) => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );
  }

  private _closeModalOnResolutionChanges(): void {
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(10),
        filter(() => !!this.modalRef),
      )
      .subscribe(
        (evt: any) => {
          if (evt.target.innerWidth > 576) {
            this.modalRef.close();
          }
        },
        (err) => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
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
}
