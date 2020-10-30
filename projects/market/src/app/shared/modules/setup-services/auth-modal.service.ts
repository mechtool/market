import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { AuthService } from '#shared/modules/common-services/auth.service';
import { ExternalProvidersService } from '#shared/modules/common-services/external-providers.service';
import { MetrikaEventTypeModel } from '#shared/modules/common-services/models';
import { EmptyOrganizationsInfoComponent } from '../components/empty-organizations-info/empty-organizations-info.component';
import { AuthDecisionMakerComponent } from '../components/auth-decision-maker/auth-decision-maker.component';

/**
 * URL пути находящиеся под аутентификацией
 */
const PATHS_WITH_AUTHORIZATION: RegExp[] = [/^\/supplier$/i, /^\/my\/organizations$/i, /^\/my\/orders$/i];

@Injectable()
export class AuthModalService {
  constructor(
    private _modalService: NzModalService,
    private _authService: AuthService,
    private _externalProvidersService: ExternalProvidersService,
  ) {}

  openAuthDecisionMakerModal(description: string, loginRedirectPath: string = `${location.pathname}${location.search}`) {
    const modal = this._modalService.create({
      nzContent: AuthDecisionMakerComponent,
      nzFooter: null,
      nzWidth: 480,
      nzComponentParams: {
        description,
        loginRedirectPath,
      },
    });
    modal.componentInstance.destroyModalChange.subscribe(() => {
      modal.destroy(true);
    });
    modal.afterClose.subscribe((result) => {
      if (!result) {
        this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.MODAL_AUTH_CLOSE);
      }
      const pathTo = loginRedirectPath;
      const pathFrom = `${location.pathname}${location.search}`;
      if (this._isPathWithAuth(PATHS_WITH_AUTHORIZATION, pathTo)) {
        this._authService.goTo(this._isPathWithAuth(PATHS_WITH_AUTHORIZATION, pathFrom) ? '/' : pathFrom);
      }
    });
  }

  openEmptyOrganizationsInfoModal(description: string) {
    const modal = this._modalService.create({
      nzContent: EmptyOrganizationsInfoComponent,
      nzFooter: null,
      nzComponentParams: {
        description,
      },
      nzWidth: 480,
    });
    modal.componentInstance.destroyModalChange.subscribe(() => {
      modal.destroy();
    });
  }

  private _isPathWithAuth(pathsWithAuth: RegExp[], currentUrl: string): boolean {
    const urlWithoutQueryParams = currentUrl.split('?')[0];
    return pathsWithAuth.some((regEx) => regEx.test(urlWithoutQueryParams));
  }
}
