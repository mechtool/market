import { Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CartService, NotificationsService, UserService } from '#shared/modules/common-services';
import { CartDataModel, CartDataResponseModel } from '#shared/modules/common-services/models';
import { take, switchMap } from 'rxjs/operators';
import { UserInfoModel } from '#shared/modules/common-services/models/user-info.model';

type CartDataCommonModel = CartDataResponseModel | CartDataModel;

@UntilDestroy({ checkProperties: true })
@Component({
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss', './cart.component-768.scss'],
})
export class CartComponent implements OnInit {
  cartData: CartDataCommonModel;
  userInfo: UserInfoModel;

  constructor(private _cartService: CartService, private _userService: UserService, private _notificationsService: NotificationsService) {}

  ngOnInit() {
    this.userInfo = this._getUserInfo();
    this._cartService.setActualCartData().pipe(
      switchMap((res) => {
        return this._cartService.getCartData$()
      }),
      take(1)
    )
      .subscribe(
        (res) => {
          this.setProps(res);
        },
        (err) => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );
  }

  setProps(cartData: any) {
    if (!cartData?.content) {
      this.cartData = null;
    }
    if (cartData?.content) {
      this.cartData = cartData;
    }
  }

  private _getUserInfo() {
    return this._userService.userData$.value?.userInfo;
  }
}
