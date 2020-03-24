import { Injectable } from '@angular/core';
import {
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  CanActivate
} from '@angular/router';
import { of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { AuthService } from '#shared/modules/common-services';
import { getQueryStringWithoutParam } from '#shared/utils';
// https://login-dev.1c.ru/login?service=https://10.70.2.97:4200/%3Fq%3D1%26t%3D2
@Injectable()
export class SsoTicketGuard implements CanActivate {
  constructor(private _authService: AuthService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {

    if (!next.queryParams.ticket) {
      return true;
    }

    if (next.queryParams.ticket) {
      const queryStringWithoutTicket = getQueryStringWithoutParam('ticket');
      const ticket = next.queryParams.ticket;
      const serviceName = `${location.origin}${location.pathname}${encodeURIComponent(queryStringWithoutTicket)}`;
      return this._authService.auth({ ticket, serviceName }).pipe(
        map((res) => {
          this._authService.setUserData(res, false);
          this._authService.goTo(`${location.pathname}${queryStringWithoutTicket}`);
          return true;
        }),
        catchError(_ => of(false)),
      );
    }

  }

}


