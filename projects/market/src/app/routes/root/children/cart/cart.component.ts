import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CartService, NotificationsService, SpinnerService, UserStateService } from '#shared/modules/common-services';
import { CartDataResponseModel } from '#shared/modules/common-services/models';
import { UserInfoModel } from '#shared/modules/common-services/models/user-info.model';
import { Subscription } from 'rxjs';
import { unsubscribeList } from '#shared/utils';

@UntilDestroy({ checkProperties: true })
@Component({
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss', './cart.component-768.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  cartData: CartDataResponseModel;
  userInfo: UserInfoModel;
  private _userDataSubscription: Subscription;

  constructor(
    private _cartService: CartService,
    private _userStateService: UserStateService,
    private _notificationsService: NotificationsService,
    private _spinnerService: SpinnerService,
  ) {
  }

  ngOnInit() {
    this._spinnerService.show();
    this._userDataSubscription = this._userStateService.currentUser$.subscribe((subject) => {
      this.userInfo = subject?.userInfo;
      this._cartService.setActualCartData()
        .subscribe((cartData) => {
            this._spinnerService.hide();
            this.setCartData(cartData);
          },
          (err) => {
            this._spinnerService.hide();
            this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
          },
        );
    });
  }

  ngOnDestroy() {
    unsubscribeList([this._userDataSubscription]);
  }

  setCartData(cartData: CartDataResponseModel) {
    if (cartData?.content) {
      this.cartData = cartData;
    } else {
      this.cartData = null;
    }
  }
}
