import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BNetService } from './bnet.service';
import { LocalStorageService } from './local-storage.service';
import { CartDataResponseModel, CartModel, RelationEnumModel, } from './models';
import { HttpErrorResponse } from '@angular/common/http';
import { delayedRetry } from '#shared/utils';

@Injectable()
export class CartService {
  private _cartLocationLink$: BehaviorSubject<string> = new BehaviorSubject(null);
  private _cartData$: BehaviorSubject<CartDataResponseModel> = new BehaviorSubject(null);

  get cartCounter$(): Observable<number> {
    return this.getCartData$().pipe(
      map((res) => {
        return res?.content.reduce((accum, curr) => {
          accum += curr.items.length;
          return accum;
        }, 0);
      }),
    );
  }

  constructor(private _bnetService: BNetService, private _localStorageService: LocalStorageService) {
    this._fillCartLocationAndDataFromStorage();
  }

  // Создание корзины
  createCart(): Observable<string> {
    return this._bnetService.createCart().pipe(
      map((response) => response.headers.get('Location')),
      tap((marketplaceLink) => {
        this.setCartLocationLink(marketplaceLink);
      }),
    );
  }

  refreshAndGetActualCartData(): Observable<CartDataResponseModel> {
    return this.getCartLocationLink$().pipe(
      switchMap((cartLocationLink) => this._bnetService.getCart(cartLocationLink)),
      catchError((err: HttpErrorResponse) => throwError(err)),
      tap((cartData) => this._setCartData(cartData)),
    )
  }

  refreshAndGetActualCartDataRetry(): Observable<CartDataResponseModel> {
    return this.getCartLocationLink$().pipe(
      switchMap((cartLocationLink) => this._bnetService.getCart(cartLocationLink)),
      catchError((err: HttpErrorResponse) => throwError(err)),
      delayedRetry(2000, 5),
      tap((cartData) => this._setCartData(cartData)),
    )
  }

  // Получение location корзины из сервиса
  getCartLocationLink$(): BehaviorSubject<string> {
    return this._cartLocationLink$;
  }

  // Есть ли в сервисе location корзины
  hasCartLocationLink(): boolean {
    return !!this._cartLocationLink$.getValue();
  }

  // Установка location корзины в сервисе
  setCartLocationLink(marketplaceLink: string): void {
    this._cartLocationLink$.next(marketplaceLink);
    this._localStorageService.putCartLocationLink(marketplaceLink);
  }

  // Получение содержимого корзины из сервиса
  getCartData$(): BehaviorSubject<CartDataResponseModel> {
    return this._cartData$;
  }

  // Установка содержимого корзины в сервисе
  private _setCartData(cartData: CartDataResponseModel): void {
    this._cartData$.next(cartData);
  }

  // Регулирование релейшнов
  handleRelation(relationType: string, relationHref: string, data?: CartModel): Observable<any> {
    switch (relationType) {
      case RelationEnumModel.ITEM_ADD:
        return this._bnetService.addItemToCart(relationHref, data);
      case RelationEnumModel.ITEM_UPDATE_QUANTITY:
        return this._bnetService.updateItemQuantityInCart(relationHref, data);
      case RelationEnumModel.ITEM_REMOVE:
        return this._bnetService.removeItemFromCart(relationHref);
    }
  }

  handleMarketplaceOffer(relationType: string, relationHref: string, data: CartModel, recaptchaToken?: string): Observable<any> {
    switch (relationType) {
      case RelationEnumModel.MAKE_ORDER:
      case RelationEnumModel.REQUEST_FOR_PRICE:
      case RelationEnumModel.REGISTER_AND_MAKE_ORDER:
      case RelationEnumModel.REGISTER_AND_REQUEST_FOR_PRICE:
        return this._bnetService.marketplaceOffer(relationHref, data, recaptchaToken);
    }
  }

  // Для внешних компонентов
  handleRelationAndUpdateData(relationType: string, relationHref: string, data?: CartModel): Observable<any> {
    return this.handleRelation(relationType, relationHref, data).pipe(switchMap(() => this.refreshAndGetActualCartDataRetry()));
  }

  // Заполнение location и содержимого корзины из сторейджа
  private _fillCartLocationAndDataFromStorage() {
    this.setCartLocationLink(this._localStorageService.getCartLocationLink());
  }
}
