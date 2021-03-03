import { Injectable, TemplateRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

@Injectable()
export class PaymentDocumentModalService {
  constructor(private _modalService: NzModalService) {}

  show(template: TemplateRef<any>) {
    return this._modalService.create({
      nzWidth: window.innerWidth >= 1040 ? 1040 : 'auto',
      nzFooter: null,
      nzContent: template,
    });
  }
}
