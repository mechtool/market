import { catchError, switchMap, take, tap } from 'rxjs/operators';
import {
  AuthService,
  CartService,
  CookieService,
  ExternalProvidersService,
  MetrikaEventAppInitProblemsEnumModel,
  MetrikaEventTypeModel,
  UserService,
} from '#shared/modules/common-services';
import { defer, Observable, of, throwError, zip } from 'rxjs';
import { Router } from '@angular/router';
import { Injector } from '@angular/core';
import { Location } from '@angular/common';
import { delayedRetry } from '#shared/utils';
import { APP_CONFIG } from './app.config.token';

let cartService = null;
let authService = null;
let cookieService = null;
let userService = null;
let externalProvidersService = null;
let location = null;
let router = null;
let retryNum = null;
let retryDelay = null;

export function ApiFactory(injector: Injector): () => Promise<any> {
  cartService = injector.get(CartService);
  authService = injector.get(AuthService);
  cookieService = injector.get(CookieService);
  userService = injector.get(UserService);
  externalProvidersService = injector.get(ExternalProvidersService);
  location = injector.get(Location);
  router = injector.get(Router);
  retryNum = injector.get(APP_CONFIG).retryNum;
  retryDelay = injector.get(APP_CONFIG).retryDelay;

  return (): Promise<any> => {
    return init();
  };
}

function init() {
  return new Promise((resolve, reject) => {
    return zip(setCart(), updateUserCategoriesRetriable$())
      .pipe(
        switchMap(() => {
          return defer(() => {
            return isTicketInQueryParams() || isCookieAuthed() ? login$() : of(null);
          });
        }),
        tap(() => {
          userService.watchUserDataChangesForUserStatusCookie();
        }),
        catchError((e) => {
          return externalProvidersService
            .fireYandexMetrikaEvent(MetrikaEventTypeModel.APP_INIT_PROBLEMS, { params: e })
            .pipe(switchMap(() => throwError(null)));
        }),
      )
      .subscribe(
        (serviceUrl) => {
          if (serviceUrl) {
            authService.redirectExternalSsoAuth(serviceUrl);
          }
          if (!serviceUrl) {
            resolve();
          }
        },
        (e) => {
          reject();
        },
      );
  });
}

function isTicketInQueryParams(): boolean {
  return location.path().includes('ticket=ST');
}

function isCookieAuthed(): boolean {
  return cookieService.isUserStatusCookieAuthed;
}

function login$(): Observable<any> {
  return authService.login(location.path(), false).pipe(
    catchError(() => {
      return throwError({
        data: MetrikaEventAppInitProblemsEnumModel.SIGN_IN,
      });
    }),
  );
}

function setCart(): Observable<any> {
  return defer(() => {
    return !cartService.hasCart() ? createCartRetriable$() : of(null);
  }).pipe(
    take(1),
    switchMap((_) => setActualCartDataRetriable$()),
    catchError((e) => throwError(e)),
  );
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
