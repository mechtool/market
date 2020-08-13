import { UntilDestroy } from '@ngneat/until-destroy';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrderStatusModal, RelationEnumModel } from '#shared/modules/common-services/models';
import { CartService, NotificationsService } from '#shared/modules/common-services';

enum Operation { REMOVE, ADD }

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-product-side',
  templateUrl: './product-side.component.html',
  styleUrls: [
    './product-side.component.scss',
  ],
})
export class ProductSideComponent implements OnInit {

  @Input() tradeOfferId: string;
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
          const cartTradeOffers = cartData.content?.reduce((accum, curr) => {
            return [...curr.items, ...accum];
          }, []);
          const foundTradeOffer = cartTradeOffers.find((x) => {
            return x.tradeOfferId === this.tradeOfferId;
          });
          if (foundTradeOffer) {
            this.orderStatus = OrderStatusModal.IN_CART;
            this.form.controls.totalPositions.setValue(foundTradeOffer.quantity, { onlySelf: true, emitEvent: false });
          } else {
            this.orderStatus = OrderStatusModal.TO_CART;
            this.form.controls.totalPositions.setValue(null, { onlySelf: true, emitEvent: false });
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
    ).subscribe(() => {
    }, (err) => {
      this._notificationsService.error('Невозможно добавить товар в корзину. Внутренняя ошибка сервера.');
      this.rollBackTotalPositions(Operation.ADD);
    });
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
            )
              .subscribe(() => {
              }, (err) => {
                this._notificationsService.error('Невозможно изменить количество товаров. Внутренняя ошибка сервера.');
                this.rollBackTotalPositions();
              });
          } else {
            this.orderStatus = OrderStatusModal.TO_CART;
            this._cartService.handleRelationAndUpdateData(
              RelationEnumModel.ITEM_REMOVE,
              `${cartLocation}/items/${this.tradeOfferId}`,
            )
              .subscribe(() => {
              }, (err) => {
                this._notificationsService.error('Невозможно удалить товар из корзины. Внутренняя ошибка сервера.');
                this.rollBackTotalPositions(Operation.REMOVE);
              });
          }
        });
  }

  private rollBackTotalPositions(operation?: Operation) {
    if (operation === Operation.REMOVE) {
      this.orderStatus = OrderStatusModal.IN_CART;
      this.form.controls.totalPositions.setValue(1, { onlySelf: true, emitEvent: false });
    } else if (operation === Operation.ADD) {
      this.orderStatus = OrderStatusModal.TO_CART;
      this.form.controls.totalPositions.setValue(0, { onlySelf: true, emitEvent: false });
    } else {
      const order = this.orderedProduct();
      if (order) {
        this.orderStatus = OrderStatusModal.IN_CART;
        this.form.controls.totalPositions.setValue(order.quantity, { onlySelf: true, emitEvent: false });
      }
    }
  }

  private orderedProduct(): any {
    const cartTradeOffers = this._cartService.getCartData$().getValue().content?.reduce((accum, curr) => {
      return [...curr.items, ...accum];
    }, []);
    return cartTradeOffers.find((x) => {
      return x.tradeOfferId === this.tradeOfferId;
    });
  }
}
