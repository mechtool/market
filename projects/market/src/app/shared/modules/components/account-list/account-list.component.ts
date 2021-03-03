import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { DocumentDto } from '#shared/modules/common-services/models';
import { EdiService, PaymentDocumentModalService } from '#shared/modules/common-services';

@Component({
  selector: 'market-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss', './account-list.component-768.scss', './account-list.component-340.scss'],
})
export class AccountListComponent {
  @Input() documents: DocumentDto[];
  @Input() page: number;
  @Output() loadDocuments: EventEmitter<number> = new EventEmitter();

  constructor(
    private _ediService: EdiService,
    private _paymentDocumentService: PaymentDocumentModalService) {
  }

  documentsLoading(nextPage: number) {
    this.loadDocuments.emit(nextPage);
  }

  openDocument(documentId: number, status: string, template: TemplateRef<any>) {
    const modal = this._paymentDocumentService.show(template);
    modal.afterOpen.subscribe(() => {
      if (status === 'SENT') {
        this._ediService.documentStatusDelivered(documentId).then(() => {
          this.documents.forEach((doc) => {
            if (doc.id === documentId) {
              doc.status = 'DELIVERED';
            }
          });
        });
      }
    });
  }
}
