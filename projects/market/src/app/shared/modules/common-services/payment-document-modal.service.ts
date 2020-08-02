import { Injectable, TemplateRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';

@Injectable()
export class PaymentDocumentModalService {

  constructor(private _modalService: NzModalService) {
  }

  show(template: TemplateRef<any>) {
    this._modalService.create({
      nzWidth: 1040,
      nzFooter: null,
      nzContent: template,
    });
  }
}
