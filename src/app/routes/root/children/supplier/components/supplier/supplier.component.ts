import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject, throwError } from 'rxjs';
import { BreadcrumbsService } from '../../../../components/breadcrumbs/breadcrumbs.service';
import {
  OrganizationResponseModel,
  OrganizationsService,
  ProductService,
  SuppliersItemModel,
  TradeOffersListResponseModel,
  TradeOffersRequestModel,
  TradeOffersService,
  TradeOfferSummaryModel
} from '#shared/modules';
import { ActivatedRoute, Params } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import { SupplierService } from '#shared/modules/common-services/supplier.service';
import { randomARGB } from '#shared/utils';

@Component({
  templateUrl: './supplier.component.html',
  styleUrls: [
    './supplier.component.scss',
    './supplier.component-992.scss',
    './supplier.component-768.scss',
  ],
})
export class SupplierSingleComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  supplier: SuppliersItemModel;
  request: TradeOffersRequestModel;
  tradeOffersList: TradeOffersListResponseModel;
  tradeOffers: TradeOfferSummaryModel[];
  supplierLogo: string;
  isLoading = false;
  tradeOffersTotal: number;
  page: number;
  query: string;

  constructor(
    private _breadcrumbsService: BreadcrumbsService,
    private _productService: ProductService,
    private _tradeOffersService: TradeOffersService,
    private _supplierService: SupplierService,
    private _organizationsService: OrganizationsService,
    private _activatedRoute: ActivatedRoute,
  ) {
    this.supplierLogo = randomARGB();
    this._initData();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  loadTradeOffers(page: number) {
    const nextPage = this.tradeOffersList.page.number + 1;
    const totalPages = this.tradeOffersList.page.totalPages;

    if (page === nextPage && nextPage < totalPages) {
      this.page = page;
      this.isLoading = true;
      this.request.page = nextPage;

      this._tradeOffersService.search(this.request)
        .subscribe((tradeOffers) => {
          this.tradeOffersList = tradeOffers;
          // todo: оптимизировать работу с памятью, возможно следует использовать scrolledUp, чтобы освобождать место
          this.tradeOffers.push(...this.tradeOffersList._embedded.items);
          this.tradeOffersTotal = this.tradeOffersList.page.totalElements;
          this.isLoading = false;
        });
    }
  }

  private _initData() {
    combineLatest([
      this._activatedRoute.params,
      this._activatedRoute.queryParams,
    ])
      .pipe(
        switchMap(([params, queryParams]) => {
          this._collectRequest(queryParams);
          const supplierId = params.id;
          return this._organizationsService.getOrganization(supplierId);
        }),
        switchMap((organization) => {
          this.supplier = this._mapSupplier(organization);
          this._initBreadcrumbs();
          this.request.supplierInn = this.supplier.inn;
          this.request.withImages = true; // todo пока так, для красоты!!!!
          return this._tradeOffersService.search(this.request);
        }),
        catchError((err) => {
          console.error('error', err);
          return throwError(err);
        }),
      )
      .subscribe((tradeOffers) => {
        this._init(tradeOffers);
      }, (err) => {
        console.error('error', err);
      });
  }

  private _collectRequest(queryParams: Params): void {
    this.query = queryParams.q;
    this.request = {
      q: queryParams.q,
      priceFrom: queryParams.priceFrom,
      priceTo: queryParams.priceTo,
      inStock: queryParams.inStock,
      withImages: queryParams.withImages,
      deliveryArea: queryParams.delivery,
      pickupArea: queryParams.pickup,
      categoryIds: queryParams.categories,
      sort: queryParams.sort,
    };
  }


  private _init(tradeOffers: TradeOffersListResponseModel): void {
    this.tradeOffersList = tradeOffers;
    this.tradeOffers = this.tradeOffersList._embedded.items;
    this.tradeOffersTotal = this.tradeOffersList.page.totalElements;
    this.page = this.tradeOffersList.page.number;
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
