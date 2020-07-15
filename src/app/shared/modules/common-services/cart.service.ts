import { BehaviorSubject, Observable, throwError, zip } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BNetService } from './bnet.service';
import { LocalStorageService } from './local-storage.service';
import { CartAddItemRequestModel, CartCreateOrderRequestModel, CartUpdateItemQuantityRequestModel, CartDataResponseModel, CartDataModel, CartDataOrderModel } from './models';

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

  constructor(
    private _bnetService: BNetService,
    private _localStorageService: LocalStorageService,
  ) {
    this._fillCartLocationAndDataFromStorage();
  }

  // Создание корзины
  createCart(): Observable<string>  {
    return this._bnetService.createCart()
      .pipe(
        map(res => res.headers.get('Location')),
        map((res) => {
          this.setCart(res);
          return res;
        },
      ));
  }

  // Мердж текущего содержимого корзины с содержимым от сервера TODO
  setActualCartData(): Observable<CartDataModel>  {
    let currentCartData = null;
    return zip(
      this.getCart$(),
      this.getCartData$()
    ).pipe(
      map(([cartLocation, cartData]) => {
        currentCartData = cartData;
        return cartLocation;
      }),
      switchMap(res => this._bnetService.getCartDataByCartLocation(res)),
      map((res) => {
        return this._mergeCardDataCurrentWithResponse(res, currentCartData)
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
  handleRelation(relationType: string, relationHref: string, data?: CartAddItemRequestModel | CartCreateOrderRequestModel | CartUpdateItemQuantityRequestModel | any): Observable<any> {
    switch(relationType) {
      case 'https://rels.1cbn.ru/marketplace/shopping-cart/add-item':
        return this._bnetService.addItemToCart(relationHref, data);
      case 'https://rels.1cbn.ru/marketplace/make-order':
        return this._bnetService.createOrder(relationHref, data);
      case 'https://rels.1cbn.ru/marketplace/shopping-cart/update-item-quantity':
        return this._bnetService.updateItemQuantityInCart(relationHref, data);
      case 'https://rels.1cbn.ru/marketplace/shopping-cart/remove-item':
        return this._bnetService.removeItemFromCart(relationHref);
      case 'https://rels.1cbn.ru/marketplace/trade-offer-view':
        return this._bnetService.getTradeOfferFromCart(relationHref);
    }
  }

  // Для внешних компонентов
  handleRelationAndUpdateData(relationType: string, relationHref: string, data?: CartAddItemRequestModel | CartCreateOrderRequestModel | CartUpdateItemQuantityRequestModel | any): Observable<any> {
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
    // TODO: пока только consumer
    let content = null;
    if (currentData) {
      const currentDataContent = currentData?.content;
      content =  data.content.reduce((accum, curr) => {
        const orderRelationRef = curr._links['https://rels.1cbn.ru/marketplace/make-order'].href;
        const orderFoundInCurrentDataContent = currentDataContent?.find(item => item._links['https://rels.1cbn.ru/marketplace/make-order'].href === orderRelationRef);
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

