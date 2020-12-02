import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { UserStateService } from '#shared/modules/common-services';
import { AuthModalService } from './auth-modal.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _userStateService: UserStateService, private _authModalService: AuthModalService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this._userStateService.userData$.pipe(
      switchMap((auth) => {
        return !!auth
          ? of(true)
          : of(
              this._authModalService.openAuthDecisionMakerModal(
                `Для продолжения работы необходимо войти на сайт под учетной записью "Интернет-поддержки пользователей (1С:ИТС)",
                указанной в вашем программном продукте "1С", или под вашей учетной записью облачного сервиса "1С:Предприятие через Интернет (1С:Фреш)".
                В случае их отсутствия - зарегистрируйте новую учетную запись.`,
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
