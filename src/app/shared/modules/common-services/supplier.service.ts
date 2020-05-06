import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BNetService } from './bnet.service';
import { SupplierInfoModel } from '#shared/modules/common-services/models/supplier-info.model';

@Injectable()
export class SupplierService {

  constructor(private _bnetService: BNetService) {
  }

  getAllSuppliers(page: number, size: number): Observable<SupplierInfoModel[]> {
    return this._bnetService.getSuppliers(undefined, page.toString(), size.toString());
  }

  findSuppliersBy(query: string): Observable<SupplierInfoModel[]> {
    return this._bnetService.getSuppliers(query);
  }
}
