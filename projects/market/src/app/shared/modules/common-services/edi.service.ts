import { Injectable } from '@angular/core';
import { DocumentResponseModel } from '#shared/modules/common-services/models';
import { Observable, of } from 'rxjs';
import { BNetService } from '#shared/modules/common-services/bnet.service';
import { UserService } from '#shared/modules/common-services/user.service';

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

  private _legalIds() {
    const userOrganizations = this._userService.userOrganizations$.getValue();
    if (userOrganizations) {
      return userOrganizations.map((org) => {
        if (org.legalRequisites.kpp) {
          return `${org.legalRequisites.inn}:${org.legalRequisites.kpp}`;
        }
        return org.legalRequisites.inn;
      });
    }
    return null;
  }

}

