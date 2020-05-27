import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject, throwError } from 'rxjs';
import { BreadcrumbsService } from '../../../../components/breadcrumbs/breadcrumbs.service';
import { OrganizationResponseModel, OrganizationsService, SuppliersItemModel } from '#shared/modules';
import { ActivatedRoute } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss'],
})
export class SupplierSingleComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  private supplier: SuppliersItemModel;

  constructor(
    private _breadcrumbsService: BreadcrumbsService,
    private _organizationsService: OrganizationsService,
    private _activatedRoute: ActivatedRoute,
  ) {
    this._initData();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  private _initData() {
    combineLatest([
      this._activatedRoute.params
        .pipe(
          switchMap((params) => {
            const supplierId = params.id;
            return this._organizationsService.getOrganization(supplierId);
          }),
          catchError((err) => {
            console.error('error', err);
            return throwError(err);
          }),
        )
    ])
      .subscribe(([organization]) => {
        this.supplier = this._mapSupplier(organization);
        this._initBreadcrumbs();
      }, (err) => {
        console.error('error', err);
      });
  }

  private _mapSupplier(organization: OrganizationResponseModel): SuppliersItemModel {
    return {
      id: organization.id,
      name: organization.name,
      inn: organization.legalRequisites.inn,
      kpp: organization.legalRequisites.kpp,
      description: organization.description,
      email: organization.contacts?.email,
      phone: organization.contacts?.phone,
      website: organization.contacts?.website,
      address: organization.contacts?.address,
    };
  }

  private _initBreadcrumbs() {
    this._breadcrumbsService.setVisible(true);
    this._breadcrumbsService.setItems([
      {
        label: 'Поставщики',
        routerLink: '/supplier'
      },
      {
        label: `${this.supplier.name}`,
        routerLink: `/supplier/${this.supplier.id}`
      },
    ]);
  }

}
