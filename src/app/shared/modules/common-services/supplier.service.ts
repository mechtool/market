import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BNetService } from './bnet.service';
import { SupplierModel } from '#shared/modules/common-services/models/supplier.model';

@Injectable()
export class SupplierService {

  constructor(private _bnetService: BNetService) {
  }

  getAllSuppliers(page: number, size: number): Observable<SupplierModel[]> {
    return this._bnetService.getSuppliers(undefined, page.toString(), size.toString());
  }

  findSuppliersBy(query: string): Observable<SupplierModel[]> {
    return this._bnetService.getSuppliers(query);
  }
}
