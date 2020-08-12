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
  TradeOfferSummaryModel
} from '#shared/modules/common-services/models';
import { ActivatedRoute, Params } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import { resizeBusinessStructure, stringToRGB } from '#shared/utils';
import { UntilDestroy } from '@ngneat/until-destroy';
import {
  NotificationsService,
  OrganizationsService,
  ProductService,
  SupplierService,
  TradeOffersService
} from '#shared/modules/common-services';

@UntilDestroy({ checkProperties: true })
@Component({
  templateUrl: './supplier.component.html',
  styleUrls: [
    './supplier.component.scss',
    './supplier.component-992.scss',
    './supplier.component-768.scss',
  ],
})
export class SupplierSingleComponent {
  supplier: SuppliersItemModel;
  request: TradeOffersRequestModel;
  tradeOffersList: TradeOffersListResponseModel;
  tradeOffers: TradeOfferSummaryModel[];
  supplierLogo: string;
  isLoadingTradeOffers = false;
  tradeOffersTotal: number;
  page: number;
  query: string;
  availableFilters: DefaultSearchAvailableModel;
  sort: SortModel;

  get name() {
    return resizeBusinessStructure(this.supplier?.name);
  }

  constructor(
    private _productService: ProductService,
    private _tradeOffersService: TradeOffersService,
    private _supplierService: SupplierService,
    private _organizationsService: OrganizationsService,
    private _activatedRoute: ActivatedRoute,
    private _notificationsService: NotificationsService,
  ) {
    this._initData();
  }

  loadTradeOffers(nextPage: number) {
    if (nextPage === this.tradeOffersList.page.number + 1 && nextPage < this.tradeOffersList.page.totalPages) {
      this.page = nextPage;
      this.isLoadingTradeOffers = true;
      this.request.page = nextPage;

      this._tradeOffersService.search(this.request)
        .subscribe(
          (tradeOffers) => {
            this.tradeOffersList = tradeOffers;
            // todo: оптимизировать работу с памятью, возможно следует использовать scrolledUp, чтобы освобождать место
            this.tradeOffers.push(...this.tradeOffersList._embedded.items);
            this.tradeOffersTotal = this.tradeOffersList.page.totalElements;
            this.isLoadingTradeOffers = false;
          },
          (err) => {
            this.isLoadingTradeOffers = false;
            this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
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
          this._collectAvailableFilters(params, queryParams);
          this._collectRequest(queryParams);
          const supplierId = params.supplierId;
          this.supplierLogo = stringToRGB(supplierId);
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
      .subscribe((tradeOffers) => {
        this._init(tradeOffers);
      }, (err) => {
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      });
  }

  private _collectAvailableFilters(params: Params, queryParams: Params) {
    this.query = queryParams.q;
    this.availableFilters = {
      supplierId: params.supplierId,
      trademark: queryParams.trademark,
      delivery: queryParams.delivery,
      pickup: queryParams.pickup,
      inStock: queryParams.inStock,
      withImages: queryParams.withImages,
      priceFrom: queryParams.priceFrom,
      priceTo: queryParams.priceTo,
      categoryId: queryParams.categoryId,
    };
    this.sort = queryParams.sort;
  }


  private _collectRequest(queryParams: Params): void {
    const delivery = queryParams.delivery === CountryCode.RUSSIA ? undefined : queryParams.delivery;
    const pickup = queryParams.pickup === CountryCode.RUSSIA ? undefined : queryParams.pickup;
    this.request = {
      q: queryParams.q,
      priceFrom: queryParams.priceFrom,
      priceTo: queryParams.priceTo,
      inStock: queryParams.inStock,
      inSales: queryParams.inStock ? queryParams.inStock : false,
      withImages: queryParams.withImages,
      deliveryArea: delivery,
      pickupArea: pickup,
      categoryId: queryParams.categoryId,
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
}
