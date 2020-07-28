import { Component, OnDestroy } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { DocumentDto } from '#shared/modules/common-services/models';
import { EdiService, LocalStorageService, NotificationsService, UserService } from '#shared/modules/common-services';

const PAGE_SIZE = 100;

@UntilDestroy({ checkProperties: true })
@Component({
  templateUrl: './orders.component.html',
  styleUrls: [
    './orders.component.scss',
    './orders.component-1300.scss',
    './orders.component-992.scss',
  ],
})
export class OrdersComponent implements OnDestroy {
  orderDocuments: DocumentDto[];
  isLoadingOrderDocuments = false;
  pageOrderDocuments = 1;
  private isNotEmptyOrderDocumentsResponse = true;

  accountDocuments: DocumentDto[];
  isLoadingAccountDocuments = false;
  pageAccountDocuments = 1;
  private isNotEmptyAccountDocumentsResponse = true;
  newAccounts: number;

  constructor(
    private _ediService: EdiService,
    private _userService: UserService,
    private _localStorageService: LocalStorageService,
    private _notificationsService: NotificationsService,
  ) {
    this._init();
  }

  ngOnDestroy(): void {
    this._localStorageService.putLastDateUserAccount(this._userService.userData$.getValue()?.userInfo.userId, new Date().valueOf());
  }

  loadOrderDocuments(nextPage: number) {
    if (nextPage === this.pageOrderDocuments + 1 && this.isNotEmptyOrderDocumentsResponse) {
      this.pageOrderDocuments = nextPage;
      this._ediService.getOrders(nextPage, PAGE_SIZE)
        .subscribe(
          (documents) => {
            if (documents?.length) {
              this.orderDocuments.push(...documents.map(doc => DocumentDto.forOrder(doc)));
            } else {
              this.isNotEmptyOrderDocumentsResponse = false;
            }
          },
          (err) => {
            this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
          });
    }
  }

  loadAccountDocuments(nextPage: number) {
    if (nextPage === this.pageAccountDocuments + 1 && this.isNotEmptyAccountDocumentsResponse) {
      this.pageAccountDocuments = nextPage;
      this._ediService.getAccounts(nextPage, PAGE_SIZE)
        .subscribe(
          (documents) => {
            if (documents?.length) {
              this.accountDocuments.push(...documents.map(doc => DocumentDto.forOrder(doc)));
            } else {
              this.isNotEmptyAccountDocumentsResponse = false;
            }
          },
          (err) => {
            this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
          });
    }
  }

  private _init() {
    this._ediService.getOrders(this.pageOrderDocuments, PAGE_SIZE)
      .subscribe(
        (documents) => {
          if (documents?.length) {
            this.orderDocuments = documents.map(doc => DocumentDto.forOrder(doc));
          } else {
            this.isNotEmptyOrderDocumentsResponse = false;
          }
        },
        (err) => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        });
    this._ediService.getAccounts(this.pageAccountDocuments, PAGE_SIZE)
      .subscribe(
        (documents) => {
          if (documents?.length) {
            this.accountDocuments = documents.map(doc => DocumentDto.forAccount(doc));
            this.newAccounts = this._countNewAccounts(this.accountDocuments);
          } else {
            this.isNotEmptyAccountDocumentsResponse = false;
          }
        },
        (err) => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        });
  }

  private _countNewAccounts(documents: DocumentDto[]) {
    const uin = this._userService.userData$.getValue()?.userInfo.userId;
    const lastVisitDate = this._localStorageService.getLastDateUserAccount(uin);
    if (lastVisitDate) {
      const newAccounts = documents.filter(doc => doc.orderDate > lastVisitDate).length;
      return newAccounts > 0 ? newAccounts : null;
    }
    return null;
  }
}