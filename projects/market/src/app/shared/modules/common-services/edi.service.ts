import { Injectable } from '@angular/core';
import { CommerceMlDocumentResponseModel, DocumentResponseModel } from '#shared/modules/common-services/models';
import { Observable, of } from 'rxjs';
import { BNetService } from '#shared/modules/common-services/bnet.service';
import { UserService } from '#shared/modules/common-services/user.service';
import { innKppToLegalId } from '#shared/utils';

@Injectable()
export class EdiService {

  constructor(
    private _bnetService: BNetService,
    private _userService: UserService
  ) {
  }

  getOrders(_page: number, _size: number): Observable<DocumentResponseModel[]> {
    const _legalIds = this._legalIds();
    if (_legalIds) {
      return this._bnetService.getOrders({
        legalIds: _legalIds,
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
    if (_legalIds) {
      return this._bnetService.getAccounts({
        legalIds: _legalIds,
        page: _page,
        size: _size,
      });
    }
    return of([]);
  }

  getAccountDocument(id: number): Observable<CommerceMlDocumentResponseModel> {
    return this._bnetService.getAccountDocument(id);
  }

  private _legalIds() {
    const userOrganizations = this._userService.userOrganizations$.getValue();
    if (userOrganizations) {
      return userOrganizations.map((org) => {
        const legalId = innKppToLegalId(org.legalRequisites.inn, org.legalRequisites.kpp);
        return legalId;
      });
    }
    return null;
  }

}

