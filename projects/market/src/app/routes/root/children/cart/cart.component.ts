import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CartService, NotificationsService, SpinnerService, UserService, UserStateService } from '#shared/modules/common-services';
import { CartDataModel, CartDataResponseModel } from '#shared/modules/common-services/models';
import { take, switchMap } from 'rxjs/operators';
import { UserInfoModel } from '#shared/modules/common-services/models/user-info.model';
import { Subscription } from "rxjs";
import { unsubscribeList } from "#shared/utils";

type CartDataCommonModel = CartDataResponseModel | CartDataModel;

@UntilDestroy({ checkProperties: true })
@Component({
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss', './cart.component-768.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  cartData: CartDataCommonModel;
  userInfo: UserInfoModel;
  isCartDataLoaded = false;
  userDataSubscription: Subscription;

  constructor(
    private _cartService: CartService,
    private _userService: UserService,
    private _userStateService: UserStateService,
    private _notificationsService: NotificationsService,
    private _spinnerService: SpinnerService,
  ) {}

  ngOnInit() {
    this._spinnerService.show();
    this.userDataSubscription = this._userStateService.userData$.subscribe((res) => {
      this.userInfo = res?.userInfo;
    })
    this._cartService
      .setActualCartData()
      .pipe(
        switchMap((res) => {
          return this._cartService.getCartData$();
        }),
        take(1),
      )
      .subscribe(
        (res) => {
          this._spinnerService.hide();
          this.isCartDataLoaded = true;
          this.setProps(res);
        },
        (err) => {
          this._spinnerService.hide();
          this.isCartDataLoaded = true;
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );
  }

  ngOnDestroy() {
    unsubscribeList([this.userDataSubscription]);
  }

  setProps(cartData: any) {
    if (!cartData?.content) {
      this.cartData = null;
    }
    if (cartData?.content) {
      this.cartData = cartData;
    }
  }

}
