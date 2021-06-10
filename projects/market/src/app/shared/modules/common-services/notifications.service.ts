import { Injectable, TemplateRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzMessageDataOptions, NzMessageRef } from "ng-zorro-antd/message/typings";

const CONFIGURATION = { nzDuration: 5000, nzPauseOnHover: true };
const ERROR_VERY_DEFAULT_TEXT = 'Сервис временно недоступен. Попробуйте позднее.';

@Injectable()
export class NotificationsService {
  private _errorTpl: TemplateRef<any> = null;

  constructor(private _messageService: NzMessageService) {}

  info(message: string | TemplateRef<void>, options?: NzMessageDataOptions): NzMessageRef {
    return this._messageService.info(message, CONFIGURATION);
  }

  error(message?: string | TemplateRef<void>, options?: NzMessageDataOptions): NzMessageRef {
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
}
