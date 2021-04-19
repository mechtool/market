import { Injectable } from '@angular/core';
import { CommerceMlDocumentResponseModel, DocumentResponseModel } from '#shared/modules/common-services/models';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { BNetService } from './bnet.service';
import { UserService } from './user.service';
import { innKppToLegalId } from '#shared/utils';
import { CookieService } from './cookie.service';
import { catchError, tap } from 'rxjs/operators';
import { UserStateService } from './user-state.service';

@Injectable()
export class EdiService {
  newAccountDocumentsCounter$: BehaviorSubject<number> = new BehaviorSubject(0);
  newInboundOrderDocumentsCounter$: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(
    private _bnetService: BNetService,
    private _userService: UserService,
    private _cookieService: CookieService,
    private _userStateService: UserStateService,
  ) {
  }

  inboundOrders(_page: number, _size: number): Observable<DocumentResponseModel[]> {
    const _legalIds = this._legalIds();
    if (_legalIds?.length) {
      return this._bnetService.getOrders({
        legalIds: _legalIds,
        inbound: true,
        page: _page,
        size: _size,
      });
    }
    return of([]);
  }

  outboundOrders(_page: number, _size: number): Observable<DocumentResponseModel[]> {
    const _legalIds = this._legalIds();
    if (_legalIds?.length) {
      return this._bnetService.getOrders({
        legalIds: _legalIds,
        inbound: false,
        page: _page,
        size: _size,
      });
    }
    return of([]);
  }

  getOrderDocument(id: number): Observable<CommerceMlDocumentResponseModel> {
    return this._bnetService.getOrderDocument(id);
  }

  getAccounts(_page: number, _size: number): Observable<DocumentResponseModel[]> {
    const _legalIds = this._legalIds();
    if (_legalIds?.length) {
      return this._bnetService.getAccounts({
        legalIds: _legalIds,
        inbound: true,
        page: _page,
        size: _size,
      });
    }
    return of([]);
  }

  getAccountDocument(id: number): Observable<CommerceMlDocumentResponseModel> {
    return this._bnetService.getAccountDocument(id);
  }

  documentStatusDelivered(documentId: number): Promise<any> {
    return this._bnetService.documentStatusDelivered(documentId);
  }

  getUserLastVisitTabAccountTimestamp(uin: string): number {
    return this._cookieService.getUserLastVisitTabAccountTimestamp(uin);
  }

  setUserLastVisitTabAccountTimestamp(uin: string, timestamp: number) {
    this._cookieService.setUserLastVisitTabAccountTimestamp(uin, timestamp);
  }

  getUserLastVisitTabInboundOrdersTimestamp(uin: string): number {
    return this._cookieService.getUserLastVisitTabInboundOrdersTimestamp(uin);
  }

  setUserLastVisitTabInboundOrdersTimestamp(uin: string, timestamp: number) {
    this._cookieService.setUserLastVisitTabInboundOrdersTimestamp(uin, timestamp);
  }

  updateNewAccountDocumentsCounter(): Observable<any> {
    return this.getAccounts(1, 100)
      .pipe(
        catchError((err) => {
          this.newAccountDocumentsCounter$.next(0);
          return of(null);
        }),
        tap((docs: DocumentResponseModel[]) => {
          const uin = this._userStateService.currentUser$.getValue()?.userInfo.userId;
          const lastLoginTimestamp = this.getUserLastVisitTabAccountTimestamp(uin);
          if (lastLoginTimestamp) {
            const counter = docs.filter((doc) => doc.sentDate > lastLoginTimestamp).length;
            this.newAccountDocumentsCounter$.next(counter);
          } else {
            this.newAccountDocumentsCounter$.next(docs?.length);
          }
        }),
      );
  }

  updateNewInboundOrdersDocumentsCounter(): Observable<any> {
    return this.inboundOrders(1, 100)
      .pipe(
        catchError((err) => {
          this.newInboundOrderDocumentsCounter$.next(0);
          return of(null);
        }),
        tap((docs: DocumentResponseModel[]) => {
          const uin = this._userStateService.currentUser$.getValue()?.userInfo.userId;
          const lastLoginTimestamp = this.getUserLastVisitTabInboundOrdersTimestamp(uin);
          if (lastLoginTimestamp) {
            const counter = docs.filter((doc) => doc.sentDate > lastLoginTimestamp).length;
            this.newInboundOrderDocumentsCounter$.next(counter);
          } else {
            this.newInboundOrderDocumentsCounter$.next(docs?.length);
          }
        }),
      );
  }

  private _legalIds() {
    const limit = 100;
    const userOrganizations = this._userService.organizations$.getValue()?.slice(0, limit);
    if (userOrganizations?.length) {
      return userOrganizations.map((org) => {
        return innKppToLegalId(org.legalRequisites.inn, org.legalRequisites.kpp);
      });
    }
    return null;
  }
}
