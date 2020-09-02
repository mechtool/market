import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { UserService } from '#shared/modules/common-services';
import { AuthModalService } from './auth-modal.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private _userService: UserService, //
    private _authModalService: AuthModalService,
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this._userService.userData$.pipe(
      switchMap((auth) => {
        return !!auth
          ? of(true)
          : of(
              this._authModalService.openAuthDecisionMakerModal(
                'Для продолжения работы необходимо зарегистрироваться или войти в свой аккаунт в 1С.',
                state.url,
              ),
            );
      }),
      catchError((e) => {
        return of(false);
      }),
    );
  }
}
