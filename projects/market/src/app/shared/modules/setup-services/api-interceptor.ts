import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { throwError, of } from 'rxjs';
import { catchError, filter, map, switchMap, tap, take } from 'rxjs/operators';
import { AuthResponseModel, AuthService, UserService } from '#shared/modules/common-services';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private _injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authService = this._injector.get(AuthService);
    const userService = this._injector.get(UserService);
    const userData = userService.userData$.value;

    const headerSettings = this._setHeaderSettings(req, userData);
    const headers = new HttpHeaders(headerSettings);

    return next.handle(req.clone({ headers })).pipe(
      filter((event: HttpEvent<any>) => event instanceof HttpResponse),
      catchError((err) => {
        if (err.status === 401) {
          const userData = userService.userData$.value;
          if (userData) {
            return authService.refresh({ refreshToken: userData.refreshToken }).pipe(
              catchError(() => {
                authService.login(location.pathname);
                return of(null);
              }),
              tap((res) => {
                userService.setUserData(res);
              }),
              switchMap((res) => {
                headerSettings['Authorization'] = `Bearer ${res.accessToken}`;
                const headers = new HttpHeaders(headerSettings);
                return next.handle(req.clone({ headers }));
              }),
            );
          }
          if (!userData) {
            return throwError(err);
          }
        }
        if (err.status === 403 && err.url.includes('auth/refresh')) {
          authService.logout();
        }
        if (err.status >= 500) {
          err.error = {
            type: 'https://api.1cbn.ru/problems/common/internal-server-error',
            instance: err.error.instance,
            title: 'Внутренняя ошибка сервера',
            detail: 'Произошла внутрення ошибка сервера',
            status: err.status,
            httpMethod: 'POST',
            requestTraceId: err.error.requestTraceId,
            internalCode: err.error.internalCode,
          };
        }
        return throwError(err);
      }),
    );
  }

  private _setHeaderSettings(req: HttpRequest<any>, userData: AuthResponseModel) {
    const headerSettings = req.headers.keys().reduce(
      (accumulator, key) => {
        accumulator[key] = req.headers.getAll(key);
        return accumulator;
      },
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
      },
    );

    if (!headerSettings['Content-type']) {
      headerSettings['Content-type'] = ['application/json'];
    }

    if (userData) {
      headerSettings['Authorization'] = `Bearer ${userData.accessToken}`;
    }

    return headerSettings;
  }
}
