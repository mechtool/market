import { CartDataExtendedModel } from '#shared/modules/common-services/models/cart-data-extended.model';
import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CartService, UserService } from '#shared/modules';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@UntilDestroy({ checkProperties: true })
@Component({
  templateUrl: './cart.component.html',
  styleUrls: [
    './cart.component.scss',
    './cart.component-768.scss',
  ],
})
export class CartComponent {
  supplierCount = 0;
  totalVat = 0;
  totalItems = 0;

  get isUserAuthed$(): Observable<boolean> {
    return this._userService.userData$.pipe(map(res => !!res));
  }

  get getCartData$(): Observable<CartDataExtendedModel> {
    return this._cartService.getCartData$().pipe(
      tap((res) => {
        this.supplierCount = res?.content?.length;
        this.totalVat = res?.content?.reduce((accum, curr, item) => {
          accum += curr.costSummary.totalVat
          return accum;
        }, 0);
        this.totalItems = res?.content?.reduce((accum, curr, item) => {
          accum += curr.items.length;
          return accum;
        }, 0);
      })
    )
  }

  constructor(
    private _cartService: CartService,
    private _userService: UserService,
  ) {}

}
