import { Injectable } from '@angular/core';
import {
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  CanActivate,
} from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '#shared/modules/common-services';

@Injectable()
export class SsoTicketGuard implements CanActivate {
  constructor(private _authService: AuthService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if (!next.queryParams.ticket) {
      return true;
    }

    if (next.queryParams.ticket) {
      return this._authService
        .login(`${location.pathname}${location.search}`)
        .pipe(
          catchError((e) => {
            console.log('error');
            return of(false);
          })
        );
    }
  }
}
