import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BNetService } from './bnet.service';
import { LocalStorageService } from './local-storage.service';
import { CartDataResponseModel, CartModel, RelationEnumModel, } from './models';

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
      tap((cartLocationLink) => {
        this.setCartLocationLink(cartLocationLink);
      }),
    );
  }

  // todo возможно стоит отказаться от этого метода, ВЕРНУТЬСЯ СЮДА
  setActualCartData(): Observable<CartDataResponseModel> {
    return this.getCartLocationLink$().pipe(
      switchMap((cartLocationLink) => {
        return this._bnetService.getCart(cartLocationLink)
      }),
      catchError((err) => throwError(err)),
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
  setCartLocationLink(cartLocationLink: string): void {
    this._cartLocationLink$.next(cartLocationLink);
    this._localStorageService.putCartLocationLink(cartLocationLink);
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
      case RelationEnumModel.MAKE_ORDER:
      case RelationEnumModel.REQUEST_FOR_PRICE:
      case RelationEnumModel.REGISTER_AND_MAKE_ORDER:
      case RelationEnumModel.REGISTER_AND_REQUEST_FOR_PRICE:
        return this._bnetService.marketplaceOffer(relationHref, data);
      case RelationEnumModel.ITEM_UPDATE_QUANTITY:
        return this._bnetService.updateItemQuantityInCart(relationHref, data);
      case RelationEnumModel.ITEM_REMOVE:
        return this._bnetService.removeItemFromCart(relationHref);
    }
  }

  // Для внешних компонентов
  handleRelationAndUpdateData(relationType: string, relationHref: string, data?: CartModel): Observable<any> {
    return this.handleRelation(relationType, relationHref, data).pipe(switchMap((_) => this.setActualCartData()));
  }

  // Заполнение location и содержимого корзины из сторейджа
  private _fillCartLocationAndDataFromStorage() {
    this.setCartLocationLink(this._localStorageService.getCartLocationLink());
  }
}
