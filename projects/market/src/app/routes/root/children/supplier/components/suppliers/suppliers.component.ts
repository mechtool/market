import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import {
  AllGroupQueryFiltersModel,
  SuppliersItemModel,
  SuppliersResponseModel
} from '#shared/modules/common-services/models';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { NotificationsService, SpinnerService, SupplierService } from '#shared/modules/common-services';

const PAGE_SIZE = 40;

@Component({
  templateUrl: './suppliers.component.html',
  styleUrls: [
    './suppliers.component.scss',
    './suppliers.component-992.scss',
    './suppliers.component-768.scss',
    './suppliers.component-576.scss',
  ],
})
export class SupplierListComponent {
  query: string;
  supplierData: SuppliersResponseModel;
  suppliers: SuppliersItemModel[];

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _supplierService: SupplierService,
    private _notificationsService: NotificationsService,
    private _spinnerService: SpinnerService,
  ) {
    this._initForm();
  }

  queryParametersChange($event: AllGroupQueryFiltersModel) {
    this.query = $event.query;
    this._router.navigate(['/supplier'], {
      queryParams: {
        q: $event.query,
      },
    });
  }

  supplierLoading() {
    const nextPage = this.supplierData.page.number + 1;

    if (nextPage < this.supplierData.page.totalPages) {
      this._spinnerService.show();

      this._getSuppliers(nextPage).subscribe(
        (suppliers) => {
          this.supplierData = suppliers;
          // todo: оптимизировать работу с памятью, возможно следует использовать scrolledUp, чтобы освобождать место
          this.suppliers.push(...this.supplierData._embedded.suppliers);
          this._spinnerService.hide();
        },
        (err) => {
          this._spinnerService.hide();
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );
    }
  }

  private _initForm() {
    this._spinnerService.show();
    combineLatest([this._activatedRoute.queryParams])
      .pipe(
        switchMap(([queryParams]) => {
          this.query = queryParams.q;
          return this._getSuppliers(0);
        }),
      )
      .subscribe(
        (suppliers) => {
          this._spinnerService.hide();
          this.supplierData = suppliers;
          this.suppliers = this.supplierData._embedded.suppliers;
        },
        (err) => {
          this._spinnerService.hide();
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );
  }

  private _getSuppliers(page: number) {
    if (this.query?.length) {
      return this._supplierService.findSuppliersBy(this.query, page, PAGE_SIZE);
    }
    return this._supplierService.getAllSuppliers(page, PAGE_SIZE);
  }
}
