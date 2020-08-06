import { AuthResponseModel } from '#shared/modules/common-services/models/auth-response.model';
import { Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CartService, NotificationsService, UserService } from '#shared/modules';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@UntilDestroy({ checkProperties: true })
@Component({
  templateUrl: './cart.component.html',
  styleUrls: [
    './cart.component.scss',
    './cart.component-768.scss',
  ],
})
export class CartComponent implements OnInit {
  supplierCount = 0;
  totalCost = 0;
  totalItems = 0;
  cartData: any;

  get userData$(): Observable<AuthResponseModel> {
    return this._userService.userData$;
  }

  constructor(
    private _cartService: CartService,
    private _userService: UserService,
    private _notificationsService: NotificationsService,
  ) {
  }

  ngOnInit() {
    this._cartService.getCartData$().pipe(
      take(1)
    ).subscribe(
      (res) => {
        this.setProps(res);
      },
      (err) => {
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      });
  }

  setProps(cartData: any) {
    this.cartData = cartData;
    this.supplierCount = cartData?.content?.length;
    this.totalCost = cartData?.content?.reduce((accum, curr, item) => {
      accum += curr.orderTotal.total;
      return accum;
    }, 0);
    this.totalItems = cartData?.content?.reduce((accum, curr, item) => {
      accum += curr.items.length;
      return accum;
    }, 0);
  }

}
