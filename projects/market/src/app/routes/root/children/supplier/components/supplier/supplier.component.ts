import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, defer, forkJoin, from, of, Subscription, throwError, zip } from 'rxjs';
import {
  AllGroupQueryFiltersModel,
  DefaultSearchAvailableModel,
  OrganizationResponseModel, ProductOffersListResponseModel,
  SortModel,
  SuppliersItemModel,
  TradeOffersListResponseModel,
  TradeOffersRequestModel,
  TradeOfferSummaryModel,
} from '#shared/modules/common-services/models';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';

import {
  LocalStorageService,
  NotificationsService,
  OrganizationsService,
  ProductService,
  SpinnerService,
  SupplierService,
  TradeOffersService,
} from '#shared/modules/common-services';
import { unsubscribeList } from '#shared/utils';

const PAGE_SIZE = 30;

@Component({
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss', './supplier.component-992.scss', './supplier.component-768.scss'],
})
export class SupplierSingleComponent implements OnDestroy {
  id = Math.random();
  supplier: SuppliersItemModel;
  request: TradeOffersRequestModel;
  tradeOffersList: TradeOffersListResponseModel;
  tradeOffers: TradeOfferSummaryModel[];
  tradeOffersTotal: number;
  page: number;
  query: string;
  filters: DefaultSearchAvailableModel;
  sort: SortModel | any;

  req: any = null;

  urlSubscription: Subscription;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _productService: ProductService,
    private _spinnerService: SpinnerService,
    private _supplierService: SupplierService,
    private _tradeOffersService: TradeOffersService,
    private _localStorageService: LocalStorageService,
    private _organizationsService: OrganizationsService,
    private _notificationsService: NotificationsService,
  ) {
    this._init();
  }

  ngOnDestroy() {
    unsubscribeList([this.urlSubscription]);
  }

  private _createReq(queryParamMap, supplierInn) {
    const req = {
      supplierInn,
      inSales: false,
      size: PAGE_SIZE,
      ...(queryParamMap.has('q') && { q: queryParamMap.get('q') }),
      ...(queryParamMap.has('trademark') && { trademark: queryParamMap.get('trademark') }),
      ...(queryParamMap.has('priceFrom') && { priceFrom: queryParamMap.get('priceFrom') }),
      ...(queryParamMap.has('priceTo') && { priceTo: queryParamMap.get('priceTo') }),
      ...(queryParamMap.has('inStock') && { inStock: queryParamMap.get('inStock') === 'true' }),
      ...(queryParamMap.has('withImages') && { withImages: queryParamMap.get('withImages') === 'true' }),
      ...(queryParamMap.has('hasDiscount') && { hasDiscount: queryParamMap.get('hasDiscount') === 'true' }),
      ...(queryParamMap.has('subCategoryId') && { categoryId: queryParamMap.get('subCategoryId') }),
      ...(queryParamMap.has('isDelivery') && { isDelivery: queryParamMap.get('isDelivery') !== 'false' }),
      ...(queryParamMap.has('isPickup') && { isPickup: queryParamMap.get('isPickup') !== 'false' }),
      ...(queryParamMap.has('sort') && { sort: queryParamMap.get('sort') }),
      ...(queryParamMap.has('page') && { page: queryParamMap.get('page') }),
    };
    return req
  }

  navigateToSupplierRoute(filterGroup: AllGroupQueryFiltersModel) {
    const page = this._activatedRoute.snapshot.queryParamMap.get('page');

    const navigationExtras = {
      queryParams: {
        ...queryParamsFromNew(filterGroup),
        ...(this._activatedRoute.snapshot.queryParamMap.has('page') && { page }),
      },
    };

    this._router.navigate(['./supplier', ...(filterGroup.filters?.supplierId ? [filterGroup.filters?.supplierId] : [])], navigationExtras);
  }

  loadTradeOffers(nextPage: number) {
    if (nextPage === this.tradeOffersList.page.number + 1 && nextPage < this.tradeOffersList.page.totalPages) {
      this.page = nextPage;
      this._spinnerService.show();
      this.req.page = nextPage;

      this._tradeOffersService.search(this.req).subscribe(
        (tradeOffers) => {
          this.tradeOffersList = tradeOffers;
          // todo: оптимизировать работу с памятью, возможно следует использовать scrolledUp, чтобы освобождать место
          this.tradeOffers.push(...this.tradeOffersList._embedded.items);
          this.tradeOffersTotal = this.tradeOffersList.page.totalElements;
          this._spinnerService.hide();
        },
        (err) => {
          this._spinnerService.hide();
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );
    }
  }

  private _init() {
    this.urlSubscription = combineLatest([this._activatedRoute.paramMap, this._activatedRoute.queryParamMap]).pipe(
      tap((organization) => {
        this._spinnerService.show();
      }),
      switchMap((res) => {
        const paramMap = this._activatedRoute.snapshot.paramMap;
        const supplierId = paramMap.get('supplierId');
        return this._organizationsService.getOrganization(supplierId);
      }),
      tap((organization) => {
        this.supplier = this._mapSupplier(organization);
        const paramMap = this._activatedRoute.snapshot.paramMap;
        const queryParamMap = this._activatedRoute.snapshot.queryParamMap;

        this._setFilters(paramMap, queryParamMap);

        this.page = +queryParamMap.get('page') || 0;
        this.req = this._createReq(queryParamMap, this.supplier.inn)

      }),
      switchMap((res) => {
        return this._tradeOffersService.search({ ...this.req, page: this.page });
      })
    )

    .subscribe((tradeOffers) => {
      this._spinnerService.hide();
      this.tradeOffersList = tradeOffers;
      this.tradeOffers = this.tradeOffersList._embedded.items;
      this.tradeOffersTotal = this.tradeOffersList.page.totalElements;
      this.page = this.tradeOffersList.page.number;
    }, (e) => {
      this._spinnerService.hide();
      if (e.status === 404) {
        this._router.navigate(['/404']);
      } else {
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      }
    });
  }

  private _setFilters(paramMap: Params, queryParamMap: Params) {
    this.query = queryParamMap?.has('q') ? queryParamMap.get('q') : '';
    this.filters = {
      ...(queryParamMap?.has('trademark') && { trademark: queryParamMap.get('trademark') }),
      ...(queryParamMap?.has('priceFrom') && { priceFrom: +queryParamMap.get('priceFrom') }),
      ...(queryParamMap?.has('priceTo') && { priceTo: +queryParamMap.get('priceTo') }),
      ...(queryParamMap?.has('inStock') && { inStock: queryParamMap.get('inStock') === 'true' }),
      ...(queryParamMap?.has('withImages') && { withImages: queryParamMap.get('withImages') === 'true' }),
      ...(queryParamMap?.has('hasDiscount') && { hasDiscount: queryParamMap.get('hasDiscount') === 'true' }),
      ...(queryParamMap?.has('subCategoryId') && { subCategoryId: queryParamMap.get('subCategoryId') }),
      ...(queryParamMap.has('isDelivery') && { isDelivery: queryParamMap.get('isDelivery') !== 'false' }),
      ...(queryParamMap.has('isPickup') && { isPickup: queryParamMap.get('isPickup') !== 'false' }),
      ...(paramMap?.has('supplierId') && { supplierId: paramMap.get('supplierId') }),
    };
    this.sort = queryParamMap.get('sort');
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

}

// TODO: перенести в общий блок (main.component.ts)
export function queryParamsFromNew(groupQuery: AllGroupQueryFiltersModel): Params {
  return {
    q: groupQuery.query?.length === 0 ? undefined : groupQuery.query,
    trademark: groupQuery.filters?.trademark,
    isDelivery: groupQuery.filters?.isDelivery ? undefined : 'false',
    isPickup: groupQuery.filters?.isPickup ? undefined : 'false',
    inStock: !groupQuery.filters?.inStock ? undefined : 'true',
    withImages: !groupQuery.filters?.withImages ? undefined : 'true',
    hasDiscount: !groupQuery.filters?.hasDiscount ? undefined : 'true',
    priceFrom: groupQuery.filters?.priceFrom === null ? undefined : groupQuery.filters.priceFrom,
    priceTo: groupQuery.filters?.priceTo === null ? undefined : groupQuery.filters.priceTo,
    subCategoryId: groupQuery.filters?.subCategoryId,
  };
}
