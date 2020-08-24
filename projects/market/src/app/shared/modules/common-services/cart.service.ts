import { BehaviorSubject, Observable, of, throwError, zip } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BNetService } from './bnet.service';
import { LocalStorageService } from './local-storage.service';
import {
  CartAddItemRequestModel,
  CartCreateOrderRequestModel,
  CartDataModel,
  CartDataOrderModel,
  CartDataResponseModel,
  CartUpdateItemQuantityRequestModel,
  RelationEnumModel
} from './models';

@Injectable()
export class CartService {
  private _cartLocation$: BehaviorSubject<string> = new BehaviorSubject(null);
  private _cartData$: BehaviorSubject<any> = new BehaviorSubject(null);

  private set _cartLocation(cartLocation: string) {
    this._cartLocation$.next(cartLocation);
    this._localStorageService.putCartLocation(cartLocation);
  }

  private set _cartData(cartData: any) {
    this._cartData$.next(cartData);
    this._localStorageService.putCartData(cartData);
  }

  get cartCounter$(): Observable<number> {
    return this.getCartData$()
      .pipe(
        map((res) => {
          return res.content.reduce((accum, curr) => {
            accum += curr.items.length;
            return accum;
          }, 0);
        })
      );
  }

  constructor(
    private _bnetService: BNetService,
    private _localStorageService: LocalStorageService,
  ) {
    this._fillCartLocationAndDataFromStorage();
  }

  // Создание корзины
  createCart(): Observable<string> {
    return this._bnetService.createCart()
      .pipe(
        map(res => res.headers.get('Location')),
        map(
          (res) => {
            this.setCart(res);
            return res;
          },
        ));
  }

  // Мердж текущего содержимого корзины с содержимым от сервера TODO
  setActualCartData(secondTime?: boolean): Observable<CartDataModel> {
    let currentCartData = null;
    return zip(
      this.getCart$(),
      this.getCartData$()
    ).pipe(
      map(([cartLocation, cartData]) => {
        currentCartData = cartData;
        return cartLocation;
      }),
      switchMap((href) => {
        return this._bnetService.getCartDataByCartLocation(href);
      }),
      catchError((error) => {
        if (error.status === 404 || secondTime) {
          return this.createCart();
        }
        // todo Нужно докрутить логики на различные типы ошибок (500 и т.д) Что делать когда 500 и др. ошибки?
        return throwError(error);
      }),
      switchMap((res: any) => {
        if (typeof res === 'string') {
          return this._bnetService.getCartDataByCartLocation(res);
        }
        return of(res);
      }),
      map((res) => {
        return this._mergeCardDataCurrentWithResponse(res, currentCartData);
      }),
      tap((res => this.setCartData(res)))
    );
  }

  // Получение location корзины из сервиса
  getCart$(): BehaviorSubject<string> {
    return this._cartLocation$;
  }

  // Есть ли в сервисе location корзины
  hasCart(): boolean {
    return !!this._cartLocation$.getValue();
  }

  // Установка location корзины в сервисе
  setCart(cartLocation: string): void {
    this._cartLocation = cartLocation;
  }

  // Удаление location корзины из сервиса
  removeCart(): void {
    this._cartLocation$.next(null);
    this._localStorageService.removeCartLocation();
  }

  // Получение содержимого корзины из сервиса
  getCartData$(): BehaviorSubject<any> {
    return this._cartData$;
  }

  // Есть ли в сервисе содержимое корзины
  hasCartData(): boolean {
    return !!this._cartData$.getValue();
  }

  // Установка содержимого корзины в сервисе
  setCartData(cartData: any): void {
    this._cartData = cartData;
  }

  // Удаление содержимого корзины из сервиса
  removeCartData(): void {
    this._cartData$.next(null);
    this._localStorageService.removeCartData();
  }

  // Регулирование релейшнов
  handleRelation(
    relationType: string,
    relationHref: string,
    data?: CartAddItemRequestModel | CartCreateOrderRequestModel | CartUpdateItemQuantityRequestModel | any,
  ): Observable<any> {
    switch (relationType) {
      case RelationEnumModel.ITEM_ADD:
        return this._bnetService.addItemToCart(relationHref, data);
      case RelationEnumModel.ORDER_CREATE:
        return this._bnetService.createOrder(relationHref, data);
      case RelationEnumModel.ITEM_UPDATE_QUANTITY:
        return this._bnetService.updateItemQuantityInCart(relationHref, data);
      case RelationEnumModel.ITEM_REMOVE:
        return this._bnetService.removeItemFromCart(relationHref);
      case RelationEnumModel.TRADE_OFFER_VIEW:
        return this._bnetService.getTradeOfferFromCart(relationHref);
    }
  }

  // Для внешних компонентов
  handleRelationAndUpdateData(
    relationType: string,
    relationHref: string,
    data?: CartAddItemRequestModel | CartCreateOrderRequestModel | CartUpdateItemQuantityRequestModel | any,
  ): Observable<any> {
    return this.handleRelation(relationType, relationHref, data).pipe(
      switchMap(_ => this.setActualCartData())
    );
  }

  // Обновление содержимого корзины из сторейджа
  pullStorageCartData() {
    this._cartData$.next(this._localStorageService.getCartData());
  }

  // Частичное обновление сторейджа
  partiallyUpdateStorageByOrder(cartDataOrder: CartDataOrderModel): void {
    this._localStorageService.patchCartDataByOrder(cartDataOrder);
  }

  // Заполнение location и содержимого корзины из сторейджа
  private _fillCartLocationAndDataFromStorage() {
    const cartLocationInStorage = this._localStorageService.getCartLocation();
    const cartDataInStorage = this._localStorageService.getCartData();
    if (!!cartLocationInStorage) {
      this.setCart(cartLocationInStorage);
      if (!!cartDataInStorage) {
        this.setCartData(cartDataInStorage);
      }
    }
  }

  // Объединение двух моделей корзины
  private _mergeCardDataCurrentWithResponse(data: CartDataResponseModel, currentData: CartDataModel): CartDataModel {
    let content = null;
    if (currentData) {
      const currentDataContent = currentData?.content;
      content = data.content.reduce((accum, curr) => {
        const orderRelationRef = curr._links?.[RelationEnumModel.ORDER_CREATE]?.href;
        const orderFoundInCurrentDataContent = currentDataContent?.find((item) => {
          return item._links?.[RelationEnumModel.ORDER_CREATE]?.href === orderRelationRef;
        });
        const newOrder = JSON.parse(JSON.stringify(curr));
        newOrder.consumer = orderFoundInCurrentDataContent?.consumer || null;
        accum.push(newOrder);
        return accum;
      }, []);
    }
    if (!currentData) {
      content = data.content.map((item) => {
        const newOrder = JSON.parse(JSON.stringify(item));
        newOrder.consumer = null;
        return newOrder;
      });
    }
    return { content, _links: data._links };
  }
}

