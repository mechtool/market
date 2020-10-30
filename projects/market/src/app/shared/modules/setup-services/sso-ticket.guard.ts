import { Inject, Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '#shared/modules/common-services';
import { delayedRetry } from '#shared/utils';
import { APP_CONFIG } from '../../../config/app.config.token';
import { AppConfigModel } from '../../../config/app.config.model';

@Injectable()
export class SsoTicketGuard implements CanActivate {
  constructor(private _authService: AuthService, private _router: Router, @Inject(APP_CONFIG) private appConfig: AppConfigModel) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if (!next.queryParams.ticket) {
      return true;
    }

    if (next.queryParams.ticket) {
      return this._authService.login(`${location.pathname}${location.search}`).pipe(
        catchError((e) => {
          return of(false);
        }),
      );
    }
  }
}
