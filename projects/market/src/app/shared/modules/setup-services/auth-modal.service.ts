import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { AuthService } from '#shared/modules/common-services';
import { RouterStateSnapshot } from '@angular/router';
import { EmptyOrganizationsInfoComponent } from '../components/empty-organizations-info/empty-organizations-info.component';
import { AuthDecisionMakerComponent } from '../components/auth-decision-maker/auth-decision-maker.component';

/**
 * URL пути находящиеся под аутентификацией
 */
const pathsWithAuth = [
  /^\/supplier$/i,
  /^\/my\/organizations$/i,
  /^\/my\/orders$/i,
];

@Injectable()
export class AuthModalService {

  constructor(
    private _modalService: NzModalService,
    private _authService: AuthService,
  ) {
  }

  // TODO: заменить этот на openAuthDecisionMakerModal в местах использования
  openNotAuthRouterModal(state: RouterStateSnapshot, currentUrl: string) {
    this._modalService.confirm({
      nzWidth: 530,
      nzTitle: '<b>Авторизуйтесь</b>',
      nzContent: '<i>Раздел доступен только авторизованным пользователям. ' +
        'Для продолжения необходимо зарегистрироваться или войти в свой аккаунт 1C.</i>',
      nzOkText: 'Вход',
      nzOnOk: () => this._authService.login(state.url),
      nzOnCancel: () => this._authService.goTo(this.isPathWithAuth(currentUrl) ? '/' : currentUrl),
    });
  }

  // TODO: заменить этот на openEmptyOrganizationsInfoModal в местах использования
  openNotOrganizationsRouterModal(state: RouterStateSnapshot, currentUrl: string) {
    this._modalService.confirm({
      nzWidth: 575,
      nzTitle: '<b>Зарегистрируйте свою организацию</b>',
      nzContent: '<i>Раздел доступен пользователям зарегистрировавшим организацию. ' +
        'Для продолжения необходимо зарегистрировать свою организацию в 1C:Бизнес-сеть.</i>',
      nzOkText: 'Зарегистрировать',
      nzOnOk: () => this._authService.goTo('my/organizations?tab=c'),
      nzOnCancel: () => this._authService.goTo(currentUrl),
    });
  }

  openAuthDecisionMakerModal() {
    const modal = this._modalService.create({
      nzContent: AuthDecisionMakerComponent,
      nzFooter: null,
      nzWidth: 480,
    });
    modal.componentInstance.destroyModalChange.subscribe(() => {
      modal.destroy();
    });
  }

  openEmptyOrganizationsInfoModal() {
    const modal = this._modalService.create({
      nzContent: EmptyOrganizationsInfoComponent,
      nzFooter: null,
      nzWidth: 480,
    });
    modal.componentInstance.destroyModalChange.subscribe(() => {
      modal.destroy();
    });
  }

  private isPathWithAuth(currentUrl: string): boolean {
    const urlWithoutQueryParams = currentUrl.split('?')[0];
    return pathsWithAuth.some(regEx => regEx.test(urlWithoutQueryParams));
  }

}
