import { catchError, switchMap, take, tap } from 'rxjs/operators';
import {
  AuthService,
  CartService,
  ExternalProvidersService,
  LocalStorageService,
  Megacity,
  MetrikaEventAppInitProblemsEnumModel,
  MetrikaEventTypeModel,
  UserService,
} from '#shared/modules/common-services';
import { defer, Observable, of, throwError, zip } from 'rxjs';
import { Router } from '@angular/router';
import { Injector } from '@angular/core';
import { Location } from '@angular/common';
import { delayedRetry, getQueryParam } from '#shared/utils';
import { APP_CONFIG } from './app.config.token';

let cartService = null;
let authService = null;
let userService = null;
let externalProvidersService = null;
let location = null;
let router = null;
let retryNum = null;
let retryDelay = null;
let localStorageService = null;

export function ApiFactory(injector: Injector): () => Promise<any> {
  cartService = injector.get(CartService);
  authService = injector.get(AuthService);
  userService = injector.get(UserService);
  externalProvidersService = injector.get(ExternalProvidersService);
  localStorageService = injector.get(LocalStorageService);
  location = injector.get(Location);
  router = injector.get(Router);
  retryNum = injector.get(APP_CONFIG).retryNum;
  retryDelay = injector.get(APP_CONFIG).retryDelay;

  return (): Promise<any> => {
    return init();
  };
}

function init() {
  handleLoginPopup();
  handleAuthFromStorage();
  setCart();

  return new Promise((resolve, reject) => {
    return zip(updateUserCategoriesRetriable$())
      .pipe(
        tap(() => {
          if (!localStorageService.hasUserLocation()) {
            localStorageService.putUserLocation(Megacity.RUSSIA);
          }
        }),
        tap(() => {
          userService.watchUserDataChangesForUserStatusCookie();
        }),
        catchError((e) => {
          externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.APP_INIT_PROBLEMS, { params: e });
          return throwError(null);
        }),
      ).subscribe(resolve, reject);
  });
}

function handleLoginPopup(): void {
  const ticket = getQueryParam('ticket', location.path());
  if (ticket) {
    window.opener.postMessage(ticket, '*');
    window.close();
  }
}

function handleAuthFromStorage(): void {
  if (localStorageService.hasUserData()) {
    const userData = localStorageService.getUserData();
    authService.setUserDependableData$(userData).subscribe();
  }
}

function setCart(): void {
  defer(() => {
    return !cartService.hasCartLocationLink() ? createCartRetriable$() : of(null);
  }).pipe(
    take(1),
    switchMap((_) => setActualCartDataRetriable$()),
    catchError((e) => throwError(e)),
  ).subscribe();
}

function createCartRetriable$(): Observable<any> {
  return delayedRetryWith(cartService.createCart()).pipe(
    catchError((e) => {
      return throwError({
        data: MetrikaEventAppInitProblemsEnumModel.CART_CREATE,
      });
    }),
  );
}

function setActualCartDataRetriable$(): Observable<any> {
  return delayedRetryWith(cartService.setActualCartData()).pipe(
    catchError((e) => {
      return createCartRetriable$();
    }),
  );
}

function updateUserCategoriesRetriable$(): Observable<any> {
  return delayedRetryWith(userService.updateUserCategories()).pipe(
    catchError((e) => {
      return throwError({
        data: MetrikaEventAppInitProblemsEnumModel.CATEGORY_LIST,
      });
    }),
  );
}

function delayedRetryWith(source: Observable<any>): Observable<any> {
  return source.pipe(delayedRetry(retryDelay, retryNum));
}
