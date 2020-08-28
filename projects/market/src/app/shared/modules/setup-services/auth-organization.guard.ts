import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, } from '@angular/router';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { UserService } from '#shared/modules/common-services';
import { AuthModalService } from './auth-modal.service';

@Injectable()
export class AuthOrganizationGuard implements CanActivate {
  constructor(
    private _userService: UserService,
    private _authModalService: AuthModalService,
    private location: Location,
  ) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this._userService.organizations$
      .pipe(
        switchMap((organizations) => {
          if (organizations?.length) {
            return of(true);
          }
          return of(this._authModalService.openNotOrganizationsRouterModal(state, this.location.path()));
        }),
        catchError((err) => {
          return of(false);
        }),
      );
  }
}
