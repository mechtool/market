import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BNetService } from './bnet.service';
import { SuppliersResponseModel } from '#shared/modules';

@Injectable()
export class SupplierService {

  constructor(private _bnetService: BNetService) {
  }

  getAllSuppliers(_page: number, _size: number): Observable<SuppliersResponseModel> {
    return this._bnetService.searchSuppliers({ page: _page, size: _size });
  }

  findSuppliers(query: string, _page: number, _size: number): Observable<SuppliersResponseModel> {
    return this._bnetService.searchSuppliers({
      q: query.length > 100 ? query.slice(0, 100) : query,
      page: _page, size: _size
    });
  }
}
