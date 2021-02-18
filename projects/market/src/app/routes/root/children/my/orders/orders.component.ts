import { Component, OnDestroy } from '@angular/core';
import { DocumentDto } from '#shared/modules/common-services/models';
import {
  EdiService,
  LocalStorageService,
  NotificationsService,
  SpinnerService,
  UserService,
  UserStateService,
} from '#shared/modules/common-services';
import { Observable } from 'rxjs';

const PAGE_SIZE = 100;

@Component({
  templateUrl: './orders.component.html',
  styleUrls: [
    './orders.component.scss',
    './orders.component-1300.scss',
    './orders.component-992.scss',
    './orders.component-576.scss'
  ],
})
export class OrdersComponent implements OnDestroy {
  orderDocuments: DocumentDto[];
  pageOrderDocuments = 1;
  private isNotEmptyOrderDocumentsResponse = true;

  accountDocuments: DocumentDto[];
  pageAccountDocuments = 1;
  private isNotEmptyAccountDocumentsResponse = true;

  get newAccountDocumentsCounter$(): Observable<number> {
    return this._userService.newAccountDocumentsCounter$;
  }

  constructor(
    private _ediService: EdiService,
    private _userService: UserService,
    private _userStateService: UserStateService,
    private _localStorageService: LocalStorageService,
    private _notificationsService: NotificationsService,
    private _spinnerService: SpinnerService,
  ) {
    this._init();
  }

  ngOnDestroy(): void {
    const uin = this._userStateService.currentUser$.value?.userInfo.userId;
    if (uin) {
      this._userService.setUserLastLoginTimestamp(uin, Date.now());
      this._userService.updateNewAccountDocumentsCounter().subscribe();
    }
  }

  loadOrderDocuments(nextPage: number) {
    if (nextPage === this.pageOrderDocuments + 1 && this.isNotEmptyOrderDocumentsResponse) {
      this._spinnerService.show();
      this.pageOrderDocuments = nextPage;
      this._ediService.getOrders(nextPage, PAGE_SIZE).subscribe(
        (documents) => {
          this._spinnerService.hide();
          if (documents?.length) {
            this.orderDocuments.push(...documents.map((doc) => DocumentDto.forOrder(doc)));
          } else {
            this.isNotEmptyOrderDocumentsResponse = false;
          }
        },
        (err) => {
          this._spinnerService.hide();
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );
    }
  }

  loadAccountDocuments(nextPage: number) {
    if (nextPage === this.pageAccountDocuments + 1 && this.isNotEmptyAccountDocumentsResponse) {
      this._spinnerService.show();
      this.pageAccountDocuments = nextPage;
      this._ediService.getAccounts(nextPage, PAGE_SIZE).subscribe(
        (documents) => {
          this._spinnerService.hide();
          if (documents?.length) {
            this.accountDocuments.push(...documents.map((doc) => DocumentDto.forAccount(doc)));
          } else {
            this.isNotEmptyAccountDocumentsResponse = false;
          }
        },
        (err) => {
          this._spinnerService.hide();
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );
    }
  }

  refreshOrderDocuments() {
    this._spinnerService.show();
    this.pageOrderDocuments = 1;
    this._ediService.getOrders(this.pageOrderDocuments, PAGE_SIZE).subscribe(
      (documents) => {
        this._spinnerService.hide();
        this.orderDocuments = documents.map((doc) => DocumentDto.forOrder(doc));
      },
      (err) => {
        this._spinnerService.hide();
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      },
    );
  }

  refreshAccountDocuments() {
    this._spinnerService.show();
    this.pageAccountDocuments = 1;
    this._ediService.getAccounts(this.pageAccountDocuments, PAGE_SIZE).subscribe(
      (documents) => {
        this._spinnerService.hide();
        this.accountDocuments = documents.map((doc) => DocumentDto.forAccount(doc));
      },
      (err) => {
        this._spinnerService.hide();
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      },
    );
  }

  refreshAll() {
    this.pageOrderDocuments = 1;
    this.pageAccountDocuments = 1;
    this._init();
  }

  private _init() {
    this._spinnerService.show();
    this._ediService.getOrders(this.pageOrderDocuments, PAGE_SIZE).subscribe(
      (documents) => {
        this._spinnerService.hide();
        if (documents?.length) {
          this.orderDocuments = documents.map((doc) => DocumentDto.forOrder(doc));
        } else {
          this.isNotEmptyOrderDocumentsResponse = false;
        }
      },
      (err) => {
        this._spinnerService.hide();
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      },
    );
    this._ediService.getAccounts(this.pageAccountDocuments, PAGE_SIZE).subscribe(
      (documents) => {
        this._spinnerService.hide();
        if (documents?.length) {
          this.accountDocuments = documents.map((doc) => DocumentDto.forAccount(doc));
        } else {
          this.isNotEmptyAccountDocumentsResponse = false;
        }
      },
      (err) => {
        this._spinnerService.hide();
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      },
    );
  }
}
