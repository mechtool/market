import { Injectable } from '@angular/core';
import { AuthService } from '#shared/modules/common-services/auth.service';
import { UserStateService } from '#shared/modules/common-services/user-state.service';
import { ExternalProvidersService } from '#shared/modules/common-services/external-providers.service';
import { MetrikaEventTypeModel } from '#shared/modules/common-services/models';
import { AddOrgOrOrderDecisionMakerComponent } from '#shared/modules/components/add-org-or-order-decision-maker';
import { AuthOrRegDecisionMakerComponent } from '#shared/modules/components/auth-or-reg-decision-maker';
import { AuthOrOrderDecisionMakerComponent } from '#shared/modules/components/auth-or-order-decision-maker';
import { EmptyOrganizationsInfoComponent } from '#shared/modules/components/empty-organizations-info';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Location } from '@angular/common';

@Injectable()
export class AuthModalService {
  constructor(
    private _modalService: NzModalService,
    private _authService: AuthService,
    private _userStateService: UserStateService,
    private _externalProvidersService: ExternalProvidersService,
    private _location: Location,
  ) {
  }

  openAuthOrOrderDecisionMakerModal(isOrderType: boolean) {
    return this._modalService.create({
      nzContent: AuthOrOrderDecisionMakerComponent,
      nzFooter: null,
      nzWidth: 480,
      nzComponentParams: {
        isOrderType,
      },
    });
  }

  openAuthOrRegDecisionMakerModal(loginRedirectPath: string = this._location.path()) {
    const modal = this._modalService.create({
      nzContent: AuthOrRegDecisionMakerComponent,
      nzFooter: null,
      nzWidth: 480,
    });

    modal.componentInstance.destroyModalChange.subscribe(() => {
      modal.destroy(true);
    });

    modal.afterClose
      .pipe(
        tap((res) => {
          if (!res) {
            this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.MODAL_AUTH_CLOSE);
          }
        }),
        filter((res) => !!res),
        switchMap((res) => {
          return this._userStateService.currentUser$;
        }),
        filter((res) => !!res),
        take(1),
      )
      .subscribe((result) => {
        this._authService.goTo(loginRedirectPath);
      });
  }

  openAddOrgOrOrderDecisionMakerModal(isOrderType: boolean) {
    return this._modalService.create({
      nzContent: AddOrgOrOrderDecisionMakerComponent,
      nzFooter: null,
      nzWidth: 480,
      nzComponentParams: {
        isOrderType,
      },
    });
  }


  openEmptyOrganizationsInfoModal() {
    const modal = this._modalService.create({
      nzContent: EmptyOrganizationsInfoComponent,
      nzFooter: null,
      nzComponentParams: {},
      nzWidth: 480,
    });

    modal.componentInstance.destroyModalChange.subscribe(() => {
      modal.destroy();
    });
  }
}
