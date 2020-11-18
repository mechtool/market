import { UntilDestroy } from '@ngneat/until-destroy';
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { DocumentDto } from '#shared/modules/common-services/models';
import { PaymentDocumentModalService } from '#shared/modules/common-services';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss', './order-list.component-768.scss', './order-list.component-340.scss'],
})
export class OrderListComponent {
  @Input() documents: DocumentDto[];
  @Input() page: number;
  @Output() loadDocuments: EventEmitter<number> = new EventEmitter();

  constructor(private _paymentDocumentService: PaymentDocumentModalService) {
  }

  documentsLoading(nextPage: number) {
    this.loadDocuments.emit(nextPage);
  }

  openDocument(template: TemplateRef<any>) {
    this._paymentDocumentService.show(template);
  }
}
