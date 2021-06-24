import { Injectable, TemplateRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzMessageRef } from 'ng-zorro-antd/message/typings';
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

  info(message: string | TemplateRef<void>): NzMessageRef {
    return this._messageService.info(message, CONFIGURATION);
  }

  error(err: any, message?: string | TemplateRef<void>): NzMessageRef {
    this._sendErrorDetailsToGTM(err);

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

  private _sendErrorDetailsToGTM(err: any): void {
    if (err) {
      const _details = [err.error?.requestTraceId, err.error?.detail, err.error?.title, err.error?.instance].filter(v => v).join('|');

      const tag = {
        event: 'siteerror',
        details: _details,
        status: err.status || 'no status',
      };
      this._externalProvidersService.fireGTMEvent(tag)
    }
  }
}
