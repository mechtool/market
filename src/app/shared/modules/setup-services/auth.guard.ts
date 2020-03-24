import { Injectable } from '@angular/core';
import {
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  CanActivate
} from '@angular/router';
import { of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { AuthService } from '#shared/modules/common-services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _authService: AuthService,) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this._authService.userData$
      .pipe(
        switchMap(x => !!x ? of(true) : this._authService.login(state.url)),
        catchError(_ => of(false)),
      );
  }
}
