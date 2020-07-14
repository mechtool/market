import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import {
  AllGroupQueryFiltersModel,
  SuppliersItemModel,
  SuppliersResponseModel,
  SupplierService,
} from '#shared/modules';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { UntilDestroy } from '@ngneat/until-destroy';

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
          console.error('error', err);
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
      .subscribe((suppliers) => {
        this.supplierData = suppliers;
        this.suppliers = this.supplierData._embedded.suppliers;
      });
  }

  private _getSuppliers(page: number) {
    if (this.query?.length) {
      return this._supplierService.findSuppliersBy(this.query, page, PAGE_SIZE);
    }
    return this._supplierService.getAllSuppliers(page, PAGE_SIZE);
  }
}
