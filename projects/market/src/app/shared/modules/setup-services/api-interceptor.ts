import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { AuthService, LocalStorageService, UserService, UserStateService } from '#shared/modules/common-services';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private _injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authService = this._injector.get(AuthService);
    const userService = this._injector.get(UserService);
    const userStateService = this._injector.get(UserStateService);
    const localStorageService = this._injector.get(LocalStorageService);
    const { accessToken = null, refreshToken = null } = userStateService.userData$.getValue() || {};
    const modifiedReq = this._modifyReq(req, accessToken);

    return next.handle(modifiedReq).pipe(
      filter((event: HttpEvent<any>) => event instanceof HttpResponse),
      catchError((err: HttpErrorResponse) => {
        if (err.url.includes('auth/refresh')) {
          localStorageService.removeUserData();
          return err.status === 403 ? authService.logout() : authService.logout('/');
        }
        if (accessToken && err.status === 401) {
          return authService.refresh({ refreshToken }).pipe(
            tap((res) => {
              userService.setUserData(res);
            }),
            switchMap((res) => {
              const req = modifiedReq.clone({
                headers: modifiedReq.headers.set('Authorization', `Bearer ${res.accessToken}`),
              });
              return next.handle(req);
            }),
          );
        }
        return throwError(err);
      }),
    );
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
