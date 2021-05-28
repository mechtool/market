import { catchError, switchMap, take } from 'rxjs/operators';
import {
  AuthService,
  CartService,
  CategoryService,
  ExternalProvidersService,
  LocalStorageService,
  Megacity,
  MetrikaEventAppInitProblemsEnumModel,
  UserService,
} from '#shared/modules/common-services';
import { defer, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Injector } from '@angular/core';
import { Location } from '@angular/common';
import { delayedRetry, getQueryParam } from '#shared/utils';
import { APP_CONFIG } from './app.config.token';

declare const ymaps: {
  geolocation: {
    country: string;
    region: string;
    city: string;
  }
  ready(fnc: () => any);
};

let authService = null;
let cartService = null;
let categoryService = null;
let externalProvidersService = null;
let localStorageService = null;
let location = null;
let router = null;
let retryNum = null;
let retryDelay = null;
let userService = null;

export function ApiFactory(injector: Injector): () => Promise<any> {
  authService = injector.get(AuthService);
  cartService = injector.get(CartService);
  categoryService = injector.get(CategoryService);
  externalProvidersService = injector.get(ExternalProvidersService);
  localStorageService = injector.get(LocalStorageService);
  location = injector.get(Location);
  router = injector.get(Router);
  retryNum = injector.get(APP_CONFIG).retryNum;
  retryDelay = injector.get(APP_CONFIG).retryDelay;
  userService = injector.get(UserService);

  return (): Promise<any> => {
    return init();
  };
}

function init() {
  return new Promise((resolve, reject) => {
    try {
      handleLoginPopup();
      handleAuthFromStorage();
      setUserLocation();
      setCategories();
      setCart();
      userService.watchUserDataChangesForUserStatusCookie();
      resolve(true);
    } catch (e) {
      reject();
    }
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
  } else {
    userService.setUserInformationSetted();
  }
}

function setUserLocation(): void {
  if (!localStorageService.hasUserLocation()) {
    localStorageService.putUserLocation(Megacity.RUSSIA);
  }

  if (!localStorageService.isApproveRegion()) {
    try {
      ymaps.ready(() => {
        localStorageService.putUserGeolocation(ymaps.geolocation);
      });
    } catch (err) {
    }
  }
}

function setCategories(): void {
  updateUserCategoriesRetriable$().subscribe();
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
  return delayedRetryWith(cartService.refreshAndGetActualCartData()).pipe(
    catchError((e) => {
      return createCartRetriable$();
    }),
  );
}

function updateUserCategoriesRetriable$(): Observable<any> {
  return delayedRetryWith(categoryService.updateCategories()).pipe(
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
