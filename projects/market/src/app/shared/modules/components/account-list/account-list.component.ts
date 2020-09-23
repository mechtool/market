import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { DocumentDto } from '#shared/modules/common-services/models';
import { resizeBusinessStructure, stringToRGB } from '#shared/utils';
import { PaymentDocumentModalService } from '#shared/modules/common-services';

@Component({
  selector: 'market-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss', './account-list.component-768.scss', './account-list.component-340.scss'],
})
export class AccountListComponent {
  @Input() documents: DocumentDto[];
  @Input() page: number;
  @Output() loadDocuments: EventEmitter<number> = new EventEmitter();

  constructor(private _paymentDocumentService: PaymentDocumentModalService) {}

  name(name: string) {
    return resizeBusinessStructure(name);
  }

  orgLogo(name: string) {
    return stringToRGB(name);
  }

  documentsLoading(nextPage: number) {
    this.loadDocuments.emit(nextPage);
  }

  openDocument(template: TemplateRef<any>) {
    this._paymentDocumentService.show(template);
  }
}
