import { Injectable } from '@angular/core';
import {
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  CanActivate,
} from '@angular/router';
import { of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { UserService, AuthService } from '#shared/modules/common-services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private _userService: UserService,
    private _authService: AuthService
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {

    return this._userService.userData$
      .pipe(
        switchMap(x => !!x ? of(true) : this._authService.login(state.url)),
        catchError((e) => {
          console.log('error');
          return of(false);
        }),
      );
  }
}
