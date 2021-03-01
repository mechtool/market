import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { catchError, filter, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { AuthService, LocalStorageService, UserService, UserStateService } from '#shared/modules/common-services';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private _isTokenRefreshing$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private _injector: Injector) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authService = this._injector.get(AuthService);
    const userService = this._injector.get(UserService);
    const userStateService = this._injector.get(UserStateService);
    const localStorageService = this._injector.get(LocalStorageService);
    let { accessToken = null, refreshToken = null } = userStateService.currentUser$.getValue() || {};

    const modifiedReq = this._modifyReq(req, accessToken);

    return of(null).pipe(
      take(1),
      mergeMap(() => {
        return next.handle(modifiedReq).pipe(
          filter((event: HttpEvent<any>) => event instanceof HttpResponse),
          catchError((err: HttpErrorResponse) => {
            if (err.url.includes('auth/refresh')) {
              localStorageService.removeUserData();
              return authService.logout();
            }
            if (accessToken && err.status === 401) {
              if (this._isTokenRefreshing$.getValue()) {
                return this._isTokenRefreshing$.pipe(
                  filter((res) => !res),
                  switchMap((res) => {
                    const req = modifiedReq.clone({
                      headers: modifiedReq.headers.set('Authorization', `Bearer ${userStateService.currentUser$.getValue()?.accessToken}`),
                    });
                    return next.handle(req);
                  })
                )
              }

              if (!this._isTokenRefreshing$.getValue()) {
                this._isTokenRefreshing$.next(true);
                return authService.refresh({ refreshToken }).pipe(
                  tap((res) => {
                    refreshToken = res.refreshToken;
                    userService.setUserData(res);
                  }),
                  switchMap((res) => {
                    const req = modifiedReq.clone({
                      headers: modifiedReq.headers.set('Authorization', `Bearer ${res.accessToken}`),
                    });
                    this._isTokenRefreshing$.next(false);
                    return next.handle(req);
                  }),
                );
              }
            }
            return throwError(err);
          }),
        );
      })
    )
  }

  private _modifyReq(req: HttpRequest<any>, bearerToken: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        ...(bearerToken && { Authorization: `Bearer ${bearerToken}` }),
        ...(!req.headers.has('Content-type') && { 'Content-type': 'application/json' }),
      },
    });
  }
}
