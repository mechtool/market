import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, } from '@angular/router';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { UserService } from '#shared/modules/common-services';
import { AuthModalService } from './auth-modal.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private _userService: UserService,
    private _authModalService: AuthModalService,
    private location: Location,
  ) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this._userService.userData$
      .pipe(
        switchMap(auth => !!auth ? of(true) : of(this._authModalService.openNotAuthRouterModal(state, this.location.path()))),
        catchError((e) => {
          console.log('error');
          return of(false);
        }),
      );
  }
}
