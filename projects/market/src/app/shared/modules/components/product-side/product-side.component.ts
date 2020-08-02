import { UntilDestroy } from '@ngneat/until-destroy';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrderStatusModal, RelationEnumModel, TradeOfferStockEnumModel } from '#shared/modules/common-services/models';
import { CartService, NotificationsService } from '#shared/modules/common-services';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'my-product-side',
  templateUrl: './product-side.component.html',
  styleUrls: [
    './product-side.component.scss',
  ],
})
export class ProductSideComponent implements OnInit {

  @Input() tradeOfferId: string;
  @Input() level: TradeOfferStockEnumModel;
  orderStatus: OrderStatusModal;
  form: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _cartService: CartService,
    private _notificationsService: NotificationsService,
  ) {
    this.form = this._fb.group({
      totalPositions: 0,
    });

    this.changeTotalPositions();
  }

  ngOnInit(): void {
    this._cartService.getCartData$()
      .subscribe(
        (cartData) => {
          const tradeOfferId = this.tradeOfferId;
          const cartTradeOffers = cartData.content?.reduce((accum, curr) => {
            return [...curr.items, ...accum];
          }, []);
          const foundTradeOffer = cartTradeOffers.find((x) => {
            const hrefSplitted = x._links[RelationEnumModel.TRADE_OFFER_VIEW].href.split('/');
            return hrefSplitted[hrefSplitted.length - 1] === tradeOfferId;
          });
          if (foundTradeOffer) {
            this.orderStatus = OrderStatusModal.IN_CART;
            this.form.controls.totalPositions.setValue(foundTradeOffer.quantity, { onlySelf: true, emitEvent: false });
          } else {
            this.orderStatus = OrderStatusModal.TO_CART;
            this.form.controls.totalPositions.setValue(null, { onlySelf: true, emitEvent: false });
          }
          if (this.level === TradeOfferStockEnumModel.OUT_OF_STOCK) {
            this.orderStatus = OrderStatusModal.NOT_AVAILABLE;
          }
        },
        (err) => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        });
  }

  decrease() {
    this.form.patchValue({ totalPositions: this.form.get('totalPositions').value - 1 });
  }

  increase() {
    this.form.patchValue({ totalPositions: this.form.get('totalPositions').value + 1 });
  }

  addToCart() {
    this.form.controls.totalPositions.setValue(1, { onlySelf: true, emitEvent: false });
    this.orderStatus = OrderStatusModal.IN_CART;
    const cartLocation = this._cartService.getCart$().value;
    this._cartService.handleRelationAndUpdateData(
      RelationEnumModel.ITEM_ADD,
      `${cartLocation}/items`,
      {
        tradeOfferId: this.tradeOfferId,
        quantity: 1,
      },
    ).subscribe();
  }

  private changeTotalPositions() {
    this.form.controls.totalPositions.valueChanges
      .subscribe(
        (value) => {
          const cartLocation = this._cartService.getCart$().value;
          if (value > 0) {
            this._cartService.handleRelationAndUpdateData(
              RelationEnumModel.ITEM_UPDATE_QUANTITY,
              `${cartLocation}/items/${this.tradeOfferId}/quantity`,
              {
                quantity: value,
              },
            ).subscribe();
          } else {
            this.orderStatus = OrderStatusModal.TO_CART;
            this._cartService.handleRelationAndUpdateData(
              RelationEnumModel.ITEM_REMOVE,
              `${cartLocation}/items/${this.tradeOfferId}`,
            ).subscribe();
          }
        },
        (err) => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        });
  }
}
