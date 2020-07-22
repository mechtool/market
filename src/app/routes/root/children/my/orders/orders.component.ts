import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { DocumentDto } from '#shared/modules/common-services/models';
import { EdiService } from '#shared/modules/common-services';

const PAGE_SIZE = 20;

@UntilDestroy({ checkProperties: true })
@Component({
  templateUrl: './orders.component.html',
  styleUrls: [
    './orders.component.scss',
    './orders.component-1300.scss',
    './orders.component-992.scss',
  ],
})
export class OrdersComponent {
  orderDocuments: DocumentDto[];
  isLoadingOrderDocuments = false;
  isNotEmptyOrderDocumentsResponse = true;
  pageOrderDocuments = 1;
  accountDocuments: DocumentDto[];
  isLoadingAccountDocuments = false;
  isNotEmptyAccountDocumentsResponse = true;
  pageAccountDocuments = 1;

  constructor(private _ediService: EdiService) {
    this._init();
  }

  private _init() {
    this._ediService.getOrders(this.pageOrderDocuments, PAGE_SIZE).subscribe((documents) => {
      if (documents?.length) {
        this.orderDocuments = documents.map(doc => DocumentDto.forOrder(doc));
      } else {
        this.isNotEmptyOrderDocumentsResponse = false;
      }
    });
    this._ediService.getAccounts(this.pageAccountDocuments, PAGE_SIZE).subscribe((documents) => {
      if (documents?.length) {
        this.accountDocuments = documents.map(doc => DocumentDto.forAccount(doc));
      } else {
        this.isNotEmptyAccountDocumentsResponse = false;
      }
    });
  }

  loadOrderDocuments(nextPage: number) {
    if (nextPage === this.pageOrderDocuments + 1 && this.isNotEmptyOrderDocumentsResponse) {
      this.pageOrderDocuments = nextPage;
      this._ediService.getOrders(nextPage, PAGE_SIZE).subscribe((documents) => {
        if (documents?.length) {
          this.orderDocuments.push(...documents.map(doc => DocumentDto.forOrder(doc)));
        } else {
          this.isNotEmptyOrderDocumentsResponse = false;
        }
      });
    }
  }

  loadAccountDocuments(nextPage: number) {
    if (nextPage === this.pageAccountDocuments + 1 && this.isNotEmptyAccountDocumentsResponse) {
      this.pageAccountDocuments = nextPage;
      this._ediService.getAccounts(nextPage, PAGE_SIZE).subscribe((documents) => {
        if (documents?.length) {
          this.accountDocuments.push(...documents.map(doc => DocumentDto.forOrder(doc)));
        } else {
          this.isNotEmptyAccountDocumentsResponse = false;
        }
      });
    }
  }
}
