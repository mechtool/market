import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { AllGroupQueryFiltersModel, SuppliersResponseModel } from '#shared/modules';
import { SupplierService } from '#shared/modules/common-services/supplier.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { BreadcrumbsService } from '../../../../components/breadcrumbs/breadcrumbs.service';

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
  query: string;
  suppliers: SuppliersResponseModel;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _supplierService: SupplierService,
    private _breadcrumbsService: BreadcrumbsService,
  ) {
    this._initForm();
    this._initBreadcrumbs();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  queryParametersChange($event: AllGroupQueryFiltersModel) {
    this.query = $event.query;
    this._router.navigate(['/supplier'], {
      queryParams: {
        q: $event.query,
      }
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
          if (!this.query || this.query?.length === 0) {
            // todo пока так, переделать!
            return this._supplierService.getAllSuppliers(0, 20);
          }
          // todo пока так, переделать!
          return this._supplierService.findSuppliersBy(this.query, 0, 20);
        })
      )
      .subscribe((suppliers) => {
        this.suppliers = this._map(suppliers);
      });
  }

  private _initBreadcrumbs() {
    this._breadcrumbsService.setVisible(false);
  }

  private _map(suppliers: SuppliersResponseModel) {
    // todo временно добавляем описание, так как пока на бэке его нет. НЕ ЗАБЫТЬ УБРАТЬ!!!
    suppliers._embedded.suppliers
      .forEach(supplier => supplier.description =
        `Описание всех возможностей и преимуществ организации ${supplier.name}, являющейся поставщиком на площадке 1С:Бизнес-Сеть.`);
    return suppliers;
  }
}
