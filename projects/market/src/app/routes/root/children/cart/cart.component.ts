import { Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CartService, NotificationsService, UserService } from '#shared/modules/common-services';
import { CartDataResponseModel, CartDataModel } from '#shared/modules/common-services/models';
import { take } from 'rxjs/operators';
import { UserInfoModel } from '#shared/modules/common-services/models/user-info.model';

type CartDataCommonModel = CartDataResponseModel | CartDataModel;

@UntilDestroy({ checkProperties: true })
@Component({
  templateUrl: './cart.component.html',
  styleUrls: [
    './cart.component.scss',
    './cart.component-768.scss',
  ],
})
export class CartComponent implements OnInit {
  supplierCount: number;
  total: number
  totalItems: number
  cartData: CartDataCommonModel;
  userInfo: UserInfoModel;

  constructor(
    private _cartService: CartService,
    private _userService: UserService,
    private _notificationsService: NotificationsService,
  ) {
  }

  ngOnInit() {
    this.userInfo = this._getUserInfo();
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
    if (!cartData?.content) {
      this.cartData = null;
      this.supplierCount = 0;
      this.total = 0;
      this.totalItems = 0;
    }
    if (cartData?.content) {
      this.cartData = cartData;
      this.supplierCount = cartData.content.length;
      this.total = this._getTotal(cartData.content);
      this.totalItems = this._getTotalItems(cartData.content);
    }
  }

  private _getUserInfo() {
    return this._userService.userData$.value?.userInfo;
  }

  private _getTotal(content: any): number {
    return content.reduce((accum, curr) => {
      accum += curr.orderTotal?.total || 0;
      return accum;
    }, 0);
  }

  private _getTotalItems(content: any): number {
    return content.reduce((accum, curr) => {
      accum += curr.items.length;
      return accum;
    }, 0);
  }

}

