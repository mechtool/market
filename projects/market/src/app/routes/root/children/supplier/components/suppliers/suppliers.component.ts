import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import {
  AllGroupQueryFiltersModel,
  SuppliersItemModel,
  SuppliersResponseModel,
} from '#shared/modules/common-services/models';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { UntilDestroy } from '@ngneat/until-destroy';
import { NotificationsService, SupplierService } from '#shared/modules/common-services';

const PAGE_SIZE = 20;

@UntilDestroy({ checkProperties: true })
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
  isLoading = false;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _supplierService: SupplierService,
    private _notificationsService: NotificationsService,
  ) {
    this._initForm();
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

    if (nextPage < this.supplierData.page.totalPages) {
      this.isLoading = true;

      this._getSuppliers(nextPage).subscribe(
        (suppliers) => {
          this.supplierData = suppliers;
          // todo: оптимизировать работу с памятью, возможно следует использовать scrolledUp, чтобы освобождать место
          this.suppliers.push(...this.supplierData._embedded.suppliers);
          this.isLoading = false;
        },
        (err) => {
          this.isLoading = false;
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        }
      );
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
      .subscribe(
        (suppliers) => {
          this.supplierData = suppliers;
          this.suppliers = this.supplierData._embedded.suppliers;
        },
        (err) => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        });
  }

  private _getSuppliers(page: number) {
    if (this.query?.length) {
      return this._supplierService.findSuppliersBy(this.query, page, PAGE_SIZE);
    }
    return this._supplierService.getAllSuppliers(page, PAGE_SIZE);
  }
}
