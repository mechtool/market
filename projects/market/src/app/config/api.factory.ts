import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService, CartService, CookieService, UserService } from '#shared/modules/common-services';
import { defer, Observable, of, throwError, zip } from 'rxjs';
import { Router } from '@angular/router';
import { Injector } from '@angular/core';
import { delayedRetry } from '#shared/utils';
import { APP_CONFIG } from './app.config.token';

let cartService = null;
let authService = null;
let cookieService = null;
let userService = null;
let router = null;
let techRouteAddress = null;
let retryNum = null;
let retryDelay = null;

export function ApiFactory(injector: Injector): () => Promise<any> {
  cartService = injector.get(CartService);
  authService = injector.get(AuthService);
  cookieService = injector.get(CookieService);
  userService = injector.get(UserService);
  router = injector.get(Router);
  techRouteAddress = injector.get(APP_CONFIG).techRouteAddress;
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
        tap(() => {
          userService.watchUserDataChangesForUserStatusCookie();
        }),
        switchMap((res) => {
          return cookieService.isUserStatusCookieAuthed ? authService.login(location.pathname, false) : of(null);
        }),
      )
      .subscribe(
        (res) => {
          if (res) {
            authService.redirectExternalSsoAuth(res);
          }
          if (!res) {
            resolve();
          }
        },
        () => {
          router.navigateByUrl(techRouteAddress);
          resolve();
        },
      );
  });
}

function setCart() {
  return defer(() => {
    return !cartService.hasCart() ? createCartRetriable$() : of(null);
  }).pipe(
    take(1),
    switchMap((_) => setActualCartDataRetriable$()),
    catchError((_) => {
      return throwError(null);
    }),
  );
}

function createCartRetriable$(): Observable<any> {
  return delayedRetryWith(cartService.createCart());
}

function setActualCartDataRetriable$(): Observable<any> {
  return delayedRetryWith(cartService.setActualCartData());
}

function updateUserCategoriesRetriable$(): Observable<any> {
  return delayedRetryWith(userService.updateUserCategories());
}

function delayedRetryWith(source: Observable<any>): Observable<any> {
  return source.pipe(delayedRetry(retryDelay, retryNum));
}
