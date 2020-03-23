import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { throwError, of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  switchMap,
  tap,
  take
} from 'rxjs/operators';
import { AuthService } from '#shared/modules/common-services';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private _injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authService = this._injector.get(AuthService);
    return authService.userData$
      .pipe(
        switchMap((userData) => {

          const headerSettings = req.headers.keys().reduce((accumulator, key) => {
            accumulator[key] = req.headers.getAll(key);
            return accumulator;
          }, {});

          if (!headerSettings['Content-type']) {
            headerSettings['Content-type'] =  ['application/json'];
          }

          if (userData) {
            headerSettings['Authorization'] = `Bearer ${userData.accessToken}`;
          }

          const headers = new HttpHeaders(headerSettings);

          return next.handle(req.clone({ headers }))
            .pipe(
              filter((event: HttpEvent<any>) => event instanceof HttpResponse),
              catchError((err) => {
                if (err.status === 401) {
                  return authService.refresh({ refreshToken: userData.refreshToken })
                    .pipe(
                      catchError(() => {
                        authService.logout();
                        return of(null);
                      }),
                      tap((res) => {
                        authService.setUserData(res);
                      }),
                      switchMap((res) => {
                        headers.set('Authorization', `Bearer ${userData.accessToken}`);
                        return next.handle(req.clone({ headers }));
                      }),
                    );
                }
                if (err.status === 403 && err.url.includes('auth/refresh')) {
                  authService.logout();
                }
                if (err.status === 500) {
                  err.error = {
                    type: 'https://api.1cbn.ru/problems/common/internal-server-error',
                    instance: err.error.instance,
                    title: 'Внутренняя ошибка сервера',
                    detail: 'Произошла внутрення ошибка сервера',
                    status: 500,
                    httpMethod: 'POST',
                    requestTraceId: err.error.requestTraceId,
                    internalCode: err.error.internalCode,
                  };
                }
                return throwError(err);
              }));
        }),
      );
  }

}
