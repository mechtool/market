import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { UserStateService } from '#shared/modules/common-services';
import { AuthModalService } from './auth-modal.service';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _userStateService: UserStateService, private _authModalService: AuthModalService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    
    return this._userStateService.isUserInformationSetted$.pipe(
      filter((res) => res),
      switchMap(() => this._userStateService.currentUser$),
      switchMap((auth) => {
        return !!auth
          ? of(true)
          : of(
              this._authModalService.openAuthOrRegDecisionMakerModal(state.url),
            );
      }),
      catchError((e) => {
        return of(false);
      }),
    )

  }
}
