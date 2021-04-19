import { Injectable, TemplateRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable()
export class NotificationsService {
  constructor(private _messageService: NzMessageService) {}

  info(message: string) {
    this._messageService.info(message, { nzDuration: 5000 });
  }

  success(message: string) {
    this._messageService.success(message);
  }

  error(message: string) {
    this._messageService.error(message, { nzDuration: 5000 });
  }

  custom(message: string | TemplateRef<void>, ms: number) {
    this._messageService.info(message, { nzDuration: ms, nzPauseOnHover: true });
  }
}
