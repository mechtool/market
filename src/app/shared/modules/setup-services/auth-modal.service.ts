import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { AuthService } from '#shared/modules/common-services';
import { RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthModalService {

  private suppliersUrlPathMatcher = /supplier/i;
  private supplierDataUrlPathMatcher = /^\/supplier\/(?:([^\/]+?))\/offer\/(?:([^\/]+?))\/?$|^\/supplier\/(?:([^\/]+?))$/i;

  constructor(
    private modal: NzModalService,
    private _authService: AuthService,
  ) {
  }

  openNotAuthRouterModal(state: RouterStateSnapshot, currentUrl: string) {
    this.modal.confirm({
      nzTitle: '<b>Раздел доступен авторизованным пользователям</b>',
      nzContent: '<i>Для продолжения необходимо зарегистрироваться или войти в свой 1С аккаунт</i>',
      nzOkText: 'Вход',
      nzOnOk: () => this._authService.login(state.url),
      nzOnCancel: () => this._authService.goTo(currentUrl.match(this.suppliersUrlPathMatcher) ? '/' : currentUrl),
    });
  }

  openNotOrganizationsRouterModal(state: RouterStateSnapshot, currentUrl: string) {
    this.modal.confirm({
      nzTitle: '<b>Раздел доступен для пользователей зарегистрировавших свою организацию</b>',
      nzContent: '<i>Для продолжения необходимо зарегистрировать свою организацию в 1C:Бизнес-сеть</i>',
      nzOkText: 'Зарегистрировать',
      nzOnOk: () => this._authService.goTo('/my/organizations/new'),
      nzOnCancel: () => this._authService.goTo(currentUrl.match(this.supplierDataUrlPathMatcher) ? '/supplier' : currentUrl),
    });
  }

}
