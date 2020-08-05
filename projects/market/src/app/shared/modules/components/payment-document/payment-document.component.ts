import { UntilDestroy } from '@ngneat/until-destroy';
import { Component, Input, OnInit } from '@angular/core';
import { CommerceMlDocumentResponseModel, EdiService, NotificationsService } from '#shared/modules/common-services';
import { resizeBusinessStructure } from '#shared/utils';

enum DocumentType { ORDER = 'ORDER', ACCOUNT = 'ACCOUNT'}

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-payment-document',
  templateUrl: './payment-document.component.html',
  styleUrls: [
    './payment-document.component.css'
  ]
})
export class PaymentDocumentComponent implements OnInit {
  @Input() documentId: number;
  @Input() documentType: DocumentType;
  document: CommerceMlDocumentResponseModel;
  isError: boolean;

  constructor(
    private _ediService: EdiService,
    private _notificationsService: NotificationsService,
  ) {
  }

  ngOnInit(): void {
    if (this.documentType === DocumentType.ORDER) {
      this._ediService.getOrderDocument(this.documentId)
        .subscribe((document) => {
          this.document = document;
        }, (err) => {
          this.isError = true;
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        });
    } else if (this.documentType === DocumentType.ACCOUNT) {
      this._ediService.getAccountDocument(this.documentId)
        .subscribe((document) => {
          this.document = document;
        }, (err) => {
          this.isError = true;
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        });
    }
  }

  name(name: string): string {
    return resizeBusinessStructure(name);
  }

  kpp(kpp: string): string {
    return kpp ? `, КПП ${kpp}` : '';
  }
}
