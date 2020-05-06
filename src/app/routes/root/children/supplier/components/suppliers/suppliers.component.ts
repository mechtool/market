import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { AllGroupQueryFiltersModel } from '#shared/modules';
import { SupplierInfoModel } from '#shared/modules/common-services/models/supplier-info.model';
import { SupplierService } from '#shared/modules/common-services/supplier.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  templateUrl: './suppliers.component.html',
  styleUrls: [
    './suppliers.component.scss',
    './suppliers.component-992.scss',
    './suppliers.component-768.scss',
    './suppliers.component-576.scss',
  ],
})
export class SupplierListComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  query = '';
  suppliers: SupplierInfoModel[];

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _supplierService: SupplierService
  ) {
    this._initForm();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  queryParametersChange($event: AllGroupQueryFiltersModel) {
    this._router.navigate(['/supplier'], {
      queryParams: {
        q: $event.query,
      }
    });

    this._supplierService.findSuppliersBy($event.query).subscribe((suppliers) => {
      this.suppliers = suppliers;
    }, (err) => {
      console.error('error', err);
    });
  }

  queryChange($event: string) {
    this.query = $event;
  }

  private _initForm() {
    combineLatest([this._activatedRoute.queryParams])
      .pipe(
        switchMap(([queryParams]) => {
          this.query = queryParams.q;
          if (this.query?.length === 0) {
            // todo пока так, переделать!
            return this._supplierService.getAllSuppliers(0, 8);
          }
          // todo пока так, переделать!
          return this._supplierService.findSuppliersBy(this.query);
        })
      )
      .subscribe((suppliers) => {
        this.suppliers = suppliers;
      });
  }
}
