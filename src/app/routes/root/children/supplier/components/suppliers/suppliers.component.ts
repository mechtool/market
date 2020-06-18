import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { AllGroupQueryFiltersModel, SuppliersItemModel, SuppliersResponseModel } from '#shared/modules';
import { SupplierService } from '#shared/modules/common-services/supplier.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { BreadcrumbsService } from '../../../../components/breadcrumbs/breadcrumbs.service';

const PAGE_SIZE = 20;

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
  supplierData: SuppliersResponseModel;
  suppliers: SuppliersItemModel[];
  isLoading = false;

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

  supplierLoading() {
    const nextPage = this.supplierData.page.number + 1;
    const totalPages = this.supplierData.page.totalPages;

    if (nextPage < totalPages) {
      this.isLoading = true;

      this._getSuppliers(nextPage).subscribe((res) => {
        this.supplierData = this._map(res);
        // todo: оптимизировать работу с памятью, возможно следует использовать scrolledUp, чтобы освобождать место
        this.suppliers.push(...this.supplierData._embedded.suppliers);
        this.isLoading = false;
      });
    }
  }

  private _initForm() {
    combineLatest([this._activatedRoute.queryParams])
      .pipe(
        switchMap(([queryParams]) => {
          this.query = queryParams.q;
          return this._getSuppliers(0);
        })
      )
      .subscribe((suppliers) => {
        this.supplierData = this._map(suppliers);
        this.suppliers = this.supplierData._embedded.suppliers;
      });
  }

  private _getSuppliers(page: number) {
    if (!this.query || this.query?.length === 0) {
      return this._supplierService.getAllSuppliers(page, PAGE_SIZE);
    }
    return this._supplierService.findSuppliersBy(this.query, page, PAGE_SIZE);
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
