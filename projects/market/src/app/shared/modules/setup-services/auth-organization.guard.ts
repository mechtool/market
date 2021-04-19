import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { catchError, debounceTime, switchMap } from 'rxjs/operators';
import { UserService, UserStateService } from '#shared/modules/common-services';
import { AuthModalService } from './auth-modal.service';

@Injectable()
export class AuthOrganizationGuard implements CanActivate {
  constructor(
    private _userService: UserService,
    private _userStateService: UserStateService,
    private _authModalService: AuthModalService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this._userService.organizations$.pipe(
      debounceTime(500),
      switchMap((organizations) => {
        if (organizations?.length) {
          return of(true);
        }
        return of(
          this._authModalService.openEmptyOrganizationsInfoModal()
        );
      }),
      catchError((err) => {
        return of(false);
      }),
    );
  }
}
