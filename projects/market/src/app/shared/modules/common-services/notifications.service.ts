import { Injectable, TemplateRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzMessageDataOptions, NzMessageRef } from 'ng-zorro-antd/message/typings';
import { ExternalProvidersService, UserStateService } from '#shared/modules';

const CONFIGURATION = { nzDuration: 5000, nzPauseOnHover: true };
const ERROR_VERY_DEFAULT_TEXT = 'Сервис временно недоступен. Попробуйте позднее.';

@Injectable()
export class NotificationsService {
  private _errorTpl: TemplateRef<any> = null;

  constructor(
    private _messageService: NzMessageService,
    private _userStateService: UserStateService,
    private _externalProvidersService: ExternalProvidersService
  ) {
  }

  info(message: string | TemplateRef<void>, options?: NzMessageDataOptions): NzMessageRef {
    return this._messageService.info(message, CONFIGURATION);
  }

  error(err: any, message?: string | TemplateRef<void>, options?: NzMessageDataOptions): NzMessageRef {

    if (err) {
      const tag = {
        event: 'siteerror',
        uin: this.userId || 'anonymous',
        url: location.href,
        error: {
          status: err.error?.status,
          title: err.error?.title,
          detail: err.error?.detail,
          instance: err.error?.instance,
          requestTraceId: err.error?.requestTraceId,
          timestamp: err.error?.timestamp
        },
      };
      this._externalProvidersService.fireGTMEvent(tag)
    }

    if (message) {
      return this._messageService.error(message, CONFIGURATION);
    }
    if (!message && this._errorTpl) {
      return this._messageService.error(this._errorTpl, CONFIGURATION);
    }
    if (!message && !this._errorTpl) {
      return this._messageService.error(ERROR_VERY_DEFAULT_TEXT, CONFIGURATION);
    }
  }

  setErrorTemplate(errorTpl: TemplateRef<any>): void {
    this._errorTpl = errorTpl;
  }

  private get userId(): string {
    return this._userStateService.currentUser$.getValue()?.userInfo.userId;
  }
}
