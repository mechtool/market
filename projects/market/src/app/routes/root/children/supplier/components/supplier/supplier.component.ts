import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, of, Subscription } from 'rxjs';
import {
  AllGroupQueryFiltersModel,
  CounterpartyResponseModel,
  DefaultSearchAvailableModel,
  OrganizationResponseModel,
  SortModel,
  SuppliersItemModel,
  TradeOffersListResponseModel,
  TradeOffersRequestModel,
  TradeOfferSummaryModel,
} from '#shared/modules/common-services/models';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';

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
import { VerificationStatusEnum } from '#shared/modules/common-services/models/verification-status.model';

const PAGE_SIZE = 30;

@Component({
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss', './supplier.component-992.scss', './supplier.component-768.scss'],
})
export class SupplierSingleComponent implements OnDestroy {
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
  deliveryAreaChange$: BehaviorSubject<any> = new BehaviorSubject(null);
  isLocationInitiallyLoaded = false;

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
      inSales: queryParamMap.get('inStock') === 'true',
      size: PAGE_SIZE,
      ...(queryParamMap.has('q') && { q: queryParamMap.get('q') }),
      ...(queryParamMap.has('tradeMark') && { tradeMark: queryParamMap.get('tradeMark') }),
      // tslint:disable-next-line:max-line-length
      ...(queryParamMap.has('priceFrom') && Number.isInteger(+queryParamMap.get('priceFrom')) && { priceFrom: +queryParamMap.get('priceFrom') * 100 }),
      // tslint:disable-next-line:max-line-length
      ...(queryParamMap.has('priceTo') && Number.isInteger(+queryParamMap.get('priceTo')) && { priceTo: +queryParamMap.get('priceTo') * 100 }),
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
    const deliveryArea = filterGroup.filters?.deliveryArea || null;
    if (deliveryArea === null || deliveryArea !== this.deliveryAreaChange$.getValue()) {
      if (!this.isLocationInitiallyLoaded) {
        this.isLocationInitiallyLoaded = true;
      } else {
        this.deliveryAreaChange$.next(deliveryArea);
      }
    }

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
    this.urlSubscription = combineLatest([
      this.deliveryAreaChange$,
      this._activatedRoute.paramMap,
      this._activatedRoute.queryParamMap,
    ]).pipe(
      tap(() => {
        this._spinnerService.show();
      }),
      switchMap(() => {
        const paramMap = this._activatedRoute.snapshot.paramMap;
        const supplierId = paramMap.get('supplierId');
        return this._organizationsService.getOrganization(supplierId);
      }),
      switchMap((organization) => {
        const inn = organization.legalRequisites?.inn;
        return combineLatest([of(organization), this._organizationsService.findCounterpartyDataByInn(inn)])
      }),
      tap(([organization, counterparty]) => {
        this.supplier = this._mapSupplier(organization, counterparty);
        const paramMap = this._activatedRoute.snapshot.paramMap;
        const queryParamMap = this._activatedRoute.snapshot.queryParamMap;

        this._setFilters(paramMap, queryParamMap);

        this.page = +queryParamMap.get('page') || 0;
        this.req = this._createReq(queryParamMap, this.supplier.inn)

      }),
      switchMap(( ) => {
        return this._tradeOffersService.search({ ...this.req, page: this.page });
      })
    ).subscribe((tradeOffers) => {
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
      ...(queryParamMap?.has('tradeMark') && { tradeMark: queryParamMap.get('tradeMark') }),
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

  private _mapSupplier(organization: OrganizationResponseModel, counterparty: CounterpartyResponseModel): SuppliersItemModel {
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
      publicInfo: counterparty,
      isVerifiedOrg: organization.verificationStatus === VerificationStatusEnum.Verified,
    };
  }

}

// TODO: перенести в общий блок (main.component.ts)
export function queryParamsFromNew(groupQuery: AllGroupQueryFiltersModel): Params {
  return {
    q: groupQuery.query?.length === 0 ? undefined : groupQuery.query,
    tradeMark: groupQuery.filters?.tradeMark,
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
