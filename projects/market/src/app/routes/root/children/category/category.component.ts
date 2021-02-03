import { Component, OnDestroy } from '@angular/core';
import { LocalStorageService } from '#shared/modules/common-services/local-storage.service';
import { DefaultSearchAvailableModel } from '#shared/modules/common-services/models/default-search-available.model';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { addURLParameters, removeURLParameters, unsubscribeList, updateUrlParameters } from '#shared/utils';
import { BehaviorSubject, combineLatest, defer, forkJoin, of, Subscription, zip } from 'rxjs';
import { NotificationsService } from '#shared/modules/common-services/notifications.service';
import { NavigationService } from '#shared/modules/common-services/navigation.service';
import { CategoryService } from '#shared/modules/common-services/category.service';
import {
  AllGroupQueryFiltersModel,
  CategoryModel,
  ProductOffersListResponseModel,
  ProductOffersModel,
  SortModel,
} from '#shared/modules/common-services/models';
import { BannerItemModel } from '#shared/modules/components/banners/models';
import { ProductService } from '#shared/modules/common-services/product.service';
import { SpinnerService } from '#shared/modules';
import { filter, switchMap, tap } from 'rxjs/operators';

@Component({
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnDestroy {
  id = Math.random();
  category: CategoryModel = null;
  filters: DefaultSearchAvailableModel;
  query: string;
  bannerItems: BannerItemModel[];

  productOffersList: ProductOffersListResponseModel;
  productOffers: ProductOffersModel[] = [];
  summaryFeaturesDate: any;
  productsTotal: number;

  sort: SortModel | any;
  page = 0;
  pageSize = 60;
  pos: number;
  scrollCommand: string;
  areAdditionalFiltersEnabled = false;
  request: any = null;
  urlSubscription: Subscription;
  private _isPopularProductsShown = false;
  private unlocked = true;

  deliveryAreaChange$: BehaviorSubject<any> = new BehaviorSubject(null);
  isLocationInitiallyLoaded = false;

  get isNotSearchUsed(): boolean {
    const queryParamsToCheck = ['q', 'supplierId', 'tradeMark', 'inStock', 'withImages', 'hasDiscount', 'features', 'priceFrom', 'priceTo', 'subCategoryId', 'isDelivery', 'isPickup', 'sort'];
    const queryParamMap = this._activatedRoute.snapshot.queryParamMap;
    const paramMap = this._activatedRoute.snapshot.paramMap;

    if (paramMap.has('id') && !!paramMap.get('id')) {
      return !queryParamMap.keys.some((queryParam) => queryParamsToCheck.includes(queryParam));
    }
    if (queryParamMap.has('q') && queryParamMap.get('q').length >= 3) {
      return false;
    }
    if (queryParamMap.has('supplierId')) {
      return false;
    }
    if (queryParamMap.has('tradeMark')) {
      return false;
    }
    if (queryParamMap.has('subCategoryId')) {
      return false;
    }
    return true;
  }

  get isPopularProductsShown(): boolean {
    return !this._activatedRoute.snapshot.paramMap.get('id') || this._isPopularProductsShown;
  }

  get showTags(): boolean {
    const queryParamKeys = [...this._activatedRoute.snapshot.queryParamMap.keys];
    const indexQ = queryParamKeys.indexOf('q');
    if (indexQ > -1) {
      queryParamKeys.splice(indexQ, 1);
    }
    const indexPage = queryParamKeys.indexOf('page');
    if (indexPage > -1) {
      queryParamKeys.splice(indexPage, 1);
    }
    return !!this._activatedRoute.snapshot.paramMap.get('id') || !!queryParamKeys.length;
  }

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _localStorageService: LocalStorageService,
    private _notificationsService: NotificationsService,
    private _navigationService: NavigationService,
    private _categoryService: CategoryService,
    private _productService: ProductService,
    private _spinnerService: SpinnerService,
    private _location: Location,
  ) {
    this._init();
  }

  ngOnDestroy() {
    this._spinnerService.hide();
    unsubscribeList([this.urlSubscription]);
  }

  navigateInCategoryRoute(filterGroup: AllGroupQueryFiltersModel): void {
    const deliveryArea = filterGroup.filters?.deliveryArea || null;
    if (deliveryArea === null || deliveryArea !== this.deliveryAreaChange$.getValue()) {
      if (!this.isLocationInitiallyLoaded) {
        this.isLocationInitiallyLoaded = true;
      } else {
        this.deliveryAreaChange$.next(deliveryArea);
      }
    }

    const categoryId = filterGroup.filters?.categoryId || null;
    const page = this._activatedRoute.snapshot.queryParamMap.get('page');
    const pos = this._activatedRoute.snapshot.queryParamMap.get('pos');
    const sort = this._activatedRoute.snapshot.queryParamMap.get('sort');

    const navigationExtras = {
      queryParams: {
        ...queryParamsFromNew(filterGroup),
        ...(this._activatedRoute.snapshot.queryParamMap.has('page') && { page }),
        ...(this._activatedRoute.snapshot.queryParamMap.has('pos') && { pos }),
        ...(this._activatedRoute.snapshot.queryParamMap.has('sort') && { sort }),
      },
    };
    this._router.navigate(['./category', ...(categoryId ? [categoryId] : [])], navigationExtras);
  }

  loadProducts(params: { pos: number; page: number }) {
    if (params.pos !== this.pos) {
      this.page = params.page;
      this.pos = params.pos;
      this._changeQueryParamsPagePosInUrl(params.page, params.pos);
    }

    if (this.unlocked && params.page > this.productOffersList?.page.number && params.page < this.productOffersList?.page.totalPages) {
      this.unlocked = false;
      this.request = { ...this.request, page: params.page, sort: this.sort, size: this.pageSize };

      this._productService.searchProductOffers(this.request)
        .subscribe((productOffers) => {
            this.productOffersList = productOffers;
            this.productOffers.push(...this.productOffersList._embedded.productOffers);
            this.productsTotal = this.productOffersList.page.totalElements;
            this.unlocked = true;
          },
          (err) => {
            this.unlocked = true;
          },
        );
    }
  }

  resetUrlFilters() {
    this._navigationService.navigateReloadable(['./category'], {
      ...(this.query && {
        queryParams: {
          q: this.query,
        },
      }),
    });
  }

  changeSortingAndRefresh(sort: SortModel) {
    const categoryId = this._activatedRoute.snapshot.paramMap.get('id');
    const navigationExtras = Object.assign({}, this._activatedRoute.snapshot.queryParams);
    navigationExtras.sort = sort
    navigationExtras.page = null
    navigationExtras.pos = null
    this._router.navigate(['./category', ...(categoryId ? [categoryId] : [])], { queryParams: navigationExtras });
  }

  private _init(): void {
    let categoryId = '';
    this.urlSubscription = combineLatest([
      this.deliveryAreaChange$,
      this._activatedRoute.paramMap,
      this._activatedRoute.queryParamMap
    ]).pipe(
      tap(() => {
        const paramMap = this._activatedRoute.snapshot.paramMap;
        const queryParamMap = this._activatedRoute.snapshot.queryParamMap;
        this._spinnerService.show();
        this._setFilters(paramMap, queryParamMap);
        this._setAdditionalFiltersVisibility(paramMap, queryParamMap);
        this._setSorting(queryParamMap);

        categoryId = paramMap.get('id');
        this.page = +queryParamMap.get('page') || 0;
        this.pos = +queryParamMap.get('pos') || 0;

        this.request = {
          query: queryParamMap.get('q') || '',
          filters: this._getRequestFilters(paramMap, queryParamMap),
          size: this.pageSize,
          ...(this.sort && { sort: this.sort }),
          ...(this.page && { page: this.page }),
        };
      }),
      switchMap(() => {
        return defer(() => {
          return categoryId
            ? zip(
              this._categoryService.getCategory(categoryId),
              this._categoryService.getCategoryBannerItems(categoryId),
              of(this._categoryService.categoryIdsPopularEnabled.includes(categoryId)),
            )
            : zip(of(null), this._categoryService.getCategoryBannerItems(''), of(true));
        }).pipe(
          tap(([category, bannerItems, isPopularProductsShown]: [CategoryModel, BannerItemModel[], boolean]) => {
            this.category = category;
            this.bannerItems = bannerItems;
            this._isPopularProductsShown = isPopularProductsShown;
          })
        )
      }),
      filter(() => {
        const pass = !!categoryId || !this.isNotSearchUsed;
        if (!pass) {
          this._spinnerService.hide();
        }
        return pass;
      }),
      switchMap(() => {
        this.productOffers = [];

        if (this.page !== 0) {
          return forkJoin(Array.from(Array(this.page).keys()).map((n) => {
            return this._productService.searchProductOffers({ ...this.request, page: n });
          })).pipe(
            switchMap((products) => {
              products.forEach((model) => {
                this.productOffers.push(...model._embedded.productOffers);
              })
              return this._productService.searchProductOffers({ ...this.request, page: this.page });
            })
          );
        }

        return this._productService.searchProductOffers(this.request);
      })
    ).subscribe((productOffers) => {

      this._spinnerService.hide();
      this.productOffersList = productOffers;

      if (this.productOffersList.page.number === 0) {
        this.productOffers = this.productOffersList._embedded.productOffers;
      } else {
        this.productOffers.push(...this.productOffersList._embedded.productOffers);
      }

      this.productsTotal = this.productOffersList.page.totalElements;
      this.summaryFeaturesDate = {
        hasProducts: this.productsTotal > 0,
        featuresQueries: this.filters?.features,
        values: this.productOffersList._embedded.summary?.features
      };

      if (this._activatedRoute.snapshot.queryParamMap.has('pos')) {
        this.scrollCommand = 'scroll';
      } else {
        this.scrollCommand = 'stand';
      }
    }, (err) => {
      this._spinnerService.hide();
      this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
    });
  }

  private _getRequestFilters(paramMap, queryParamMap) {
    return {
      ...(queryParamMap.has('supplierId') && { supplierId: queryParamMap.get('supplierId') }),
      ...(queryParamMap.has('tradeMark') && { tradeMark: queryParamMap.get('tradeMark') }),
      ...(queryParamMap.has('isDelivery') && { isDelivery: queryParamMap.get('isDelivery') !== 'false' }),
      ...(queryParamMap.has('isPickup') && { isPickup: queryParamMap.get('isPickup') !== 'false' }),
      ...(queryParamMap.has('inStock') && { inStock: queryParamMap.get('inStock') === 'true' }),
      ...(queryParamMap.has('withImages') && { withImages: queryParamMap.get('withImages') === 'true' }),
      ...(queryParamMap.has('hasDiscount') && { hasDiscount: queryParamMap.get('hasDiscount') === 'true' }),
      ...(queryParamMap.has('priceFrom') && { priceFrom: +queryParamMap.get('priceFrom') }),
      ...(queryParamMap.has('priceTo') && { priceTo: +queryParamMap.get('priceTo') }),
      ...(queryParamMap.has('features') && { features: queryParamMap.getAll('features') }),
      ...(paramMap.has('id') && paramMap.get('id') !== '' && { categoryId: paramMap.get('id') }),
      ...(queryParamMap.has('subCategoryId') && { categoryId: queryParamMap.get('subCategoryId') }),
    };
  }

  private _setFilters(paramMap: Params, queryParamMap: Params) {
    this.query = queryParamMap?.has('q') ? queryParamMap.get('q') : '';
    this.filters = this._getRequestFilters(paramMap, queryParamMap);
  }

  private _setAdditionalFiltersVisibility(paramMap: Params, queryParamMap: Params) {
    if (paramMap.get('id')) {
      this.areAdditionalFiltersEnabled = true;
    }
    if (!paramMap.get('id')) {
      if (queryParamMap.get('q') && queryParamMap.get('q').length >= 3) {
        this.areAdditionalFiltersEnabled = true;
      }
      if (queryParamMap.get('supplierId')) {
        this.areAdditionalFiltersEnabled = true;
      }
      if (queryParamMap.get('tradeMark')) {
        this.areAdditionalFiltersEnabled = true;
      }
      if (queryParamMap.get('subCategoryId')) {
        this.areAdditionalFiltersEnabled = true;
      }
    }
  }

  private _setSorting(queryParamMap: ParamMap) {
    this.sort = queryParamMap.get('sort') || null;
  }

  private _changeQueryParamsPagePosInUrl(page: number, pos: number) {
    let url;
    if (page) {
      if (this._activatedRoute.snapshot.queryParamMap.get('page')) {
        const params = new Map([['page', page], ['pos', pos]]);
        url = updateUrlParameters(this._router.url, params);
      } else {
        url = removeURLParameters(this._router.url, 'pos');
        const params = new Map([['page', page], ['pos', pos]]);
        url = addURLParameters(url, params);
      }
    } else if (!page && pos > 3) {
      if (this._activatedRoute.snapshot.queryParamMap.get('pos')) {
        const params = new Map([['pos', pos]]);
        url = removeURLParameters(this._router.url, 'page');
        url = updateUrlParameters(url, params);
      } else {
        const params = new Map([['pos', pos]]);
        url = addURLParameters(this._router.url, params);
      }
    } else {
      url = removeURLParameters(this._router.url, 'page', 'pos');
      this._router.navigateByUrl(url, { skipLocationChange: true })
    }
    this._location.replaceState(url);
  }
}

// TODO: перенести в общий блок (main.component.ts)
function queryParamsFromNew(groupQuery: AllGroupQueryFiltersModel): Params {
  return {
    q: groupQuery.query?.length === 0 ? undefined : groupQuery.query,
    supplierId: groupQuery.filters?.supplierId,
    tradeMark: groupQuery.filters?.tradeMark,
    isDelivery: groupQuery.filters?.isDelivery ? undefined : 'false',
    isPickup: groupQuery.filters?.isPickup ? undefined : 'false',
    inStock: !groupQuery.filters?.inStock ? undefined : 'true',
    withImages: !groupQuery.filters?.withImages ? undefined : 'true',
    hasDiscount: !groupQuery.filters?.hasDiscount ? undefined : 'true',
    features: !groupQuery.filters?.features?.length ? undefined : groupQuery.filters.features,
    priceFrom: groupQuery.filters?.priceFrom === null ? undefined : groupQuery.filters.priceFrom,
    priceTo: groupQuery.filters?.priceTo === null ? undefined : groupQuery.filters.priceTo,
    subCategoryId: groupQuery.filters?.subCategoryId,
  };
}
