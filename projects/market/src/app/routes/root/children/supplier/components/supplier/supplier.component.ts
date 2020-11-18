import { Component } from '@angular/core';
import { combineLatest, throwError } from 'rxjs';
import {
  CountryCode,
  DefaultSearchAvailableModel,
  OrganizationResponseModel,
  SortModel,
  SuppliersItemModel,
  TradeOffersListResponseModel,
  TradeOffersRequestModel,
  TradeOfferSummaryModel,
} from '#shared/modules/common-services/models';
import { ActivatedRoute, Params } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';

import {
  LocalStorageService,
  NotificationsService,
  OrganizationsService,
  ProductService,
  SpinnerService,
  SupplierService,
  TradeOffersService,
} from '#shared/modules/common-services';

@Component({
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss', './supplier.component-992.scss', './supplier.component-768.scss'],
})
export class SupplierSingleComponent {
  supplier: SuppliersItemModel;
  request: TradeOffersRequestModel;
  tradeOffersList: TradeOffersListResponseModel;
  tradeOffers: TradeOfferSummaryModel[];
  tradeOffersTotal: number;
  page: number;
  query: string;
  filters: DefaultSearchAvailableModel;
  sort: SortModel;

  constructor(
    private _productService: ProductService,
    private _tradeOffersService: TradeOffersService,
    private _supplierService: SupplierService,
    private _organizationsService: OrganizationsService,
    private _activatedRoute: ActivatedRoute,
    private _notificationsService: NotificationsService,
    private _localStorageService: LocalStorageService,
    private _spinnerService: SpinnerService,
  ) {
    this._init();
  }

  loadTradeOffers(nextPage: number) {
    if (nextPage === this.tradeOffersList.page.number + 1 && nextPage < this.tradeOffersList.page.totalPages) {
      this.page = nextPage;
      this._spinnerService.show();
      this.request.page = nextPage;

      this._tradeOffersService.search(this.request).subscribe(
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

  changeCityAndRefresh(isRefresh: boolean) {
    if (isRefresh) {
      this._init();
    }
  }

  private _init() {
    combineLatest([this._activatedRoute.params, this._activatedRoute.queryParams])
      .pipe(
        switchMap(([params, queryParams]) => {
          this._spinnerService.show();
          this._collectFilters(params, queryParams);
          this._collectRequest();
          const supplierId = params.supplierId;
          return this._organizationsService.getOrganization(supplierId);
        }),
        switchMap((organization) => {
          this.supplier = this._mapSupplier(organization);
          this.request.supplierInn = this.supplier.inn;
          return this._tradeOffersService.search(this.request);
        }),
        catchError((err) => {
          return throwError(err);
        }),
      )
      .subscribe(
        (tradeOffers) => {
          this._spinnerService.hide();
          this._initData(tradeOffers);
        },
        (err) => {
          this._spinnerService.hide();
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );
  }

  private _collectFilters(params: Params, queryParams: Params) {
    this.query = queryParams.q;
    this.filters = {
      supplierId: params.supplierId,
      trademark: queryParams.trademark,
      isDelivery: queryParams.isDelivery !== 'false',
      isPickup: queryParams.isPickup !== 'false',
      inStock: queryParams.inStock,
      withImages: queryParams.withImages,
      priceFrom: queryParams.priceFrom,
      priceTo: queryParams.priceTo,
      categoryId: queryParams.categoryId,
    };
    this.sort = queryParams.sort;
  }

  private _collectRequest(): void {
    const fias = this._fias();
    this.request = {
      q: this.query,
      priceFrom: this.filters.priceFrom ? this.filters.priceFrom * 100 : undefined,
      priceTo: this.filters.priceTo ? this.filters.priceTo * 100 : undefined,
      inStock: this.filters.inStock,
      inSales: this.filters.inStock ? this.filters.inStock : false,
      withImages: this.filters.withImages,
      deliveryArea: this.filters.isDelivery ? fias : undefined,
      pickupArea: this.filters.isPickup ? fias : undefined,
      categoryId: this.filters.categoryId,
      sort: this.sort,
    };
  }

  private _initData(tradeOffers: TradeOffersListResponseModel): void {
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

  private _fias() {
    return this._localStorageService.getUserLocation()?.fias === CountryCode.RUSSIA
      ? undefined
      : this._localStorageService.getUserLocation()?.fias;
  }
}
