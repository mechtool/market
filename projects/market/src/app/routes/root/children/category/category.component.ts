import { Component, OnDestroy } from '@angular/core';
import { LocalStorageService } from '#shared/modules/common-services/local-storage.service';
import { DefaultSearchAvailableModel } from '#shared/modules/common-services/models/default-search-available.model';
import { ActivatedRoute, NavigationExtras, ParamMap, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  addURLParameters,
  queryParamsForProductsFrom,
  removeURLParameters,
  unsubscribeList,
  updateUrlParameters
} from '#shared/utils';
import { combineLatest, defer, forkJoin, of, Subscription } from 'rxjs';
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
import { ProductService } from '#shared/modules/common-services/product.service';
import { SearchResultsService, SpinnerService } from '#shared/modules';
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

  productOffersList: ProductOffersListResponseModel;
  productOffers: ProductOffersModel[] = [];
  summaryFeaturesData: any;
  productsTotal: number;

  sort: SortModel | any;
  page = 0;
  pageSize = 60;
  pos: number;
  areAdditionalFiltersEnabled = false;

  isLoading = false;
  showClearAllFilters = false;

  private request: any = null;
  private urlSubscription: Subscription;
  private utmTags = ['utm_campaign', 'utm_content', 'utm_medium', 'utm_source', 'utm_term', 'yclid'];
  private isUrlInitiallyLoaded = false;
  private unlocked = true;
  private _isSearchUsed = false;

  get isSearchUsed(): boolean {
    return this._isSearchUsed;
  }

  constructor(
    private _router: Router,
    private _location: Location,
    private _productService: ProductService,
    private _spinnerService: SpinnerService,
    private _activatedRoute: ActivatedRoute,
    private _categoryService: CategoryService,
    private _navigationService: NavigationService,
    private _localStorageService: LocalStorageService,
    private _notificationsService: NotificationsService,
    private _searchResultsService: SearchResultsService,
  ) {
    this._init();
  }

  ngOnDestroy() {
    this._spinnerService.hide();
    unsubscribeList([this.urlSubscription]);
  }

  updateResultsByFilters(filterGroup: AllGroupQueryFiltersModel): void {

    this.query = filterGroup.query;
    this.filters = filterGroup.filters;

    const queryParams = {
      ...queryParamsForProductsFrom(filterGroup),
      ...(this.sort && { sort: this.sort }),
    }

    const categoryId = filterGroup.filters?.categoryId || null;
    this._location.go(`/category${categoryId ? `/${categoryId}` : ''}`, this._paramsToString(queryParams));
    this._searchResultsService.searchingResultsChanges$.next(true);

    const currentUrl = this._location.path().split('?');
    const catId = currentUrl[0]?.split('/')[2];
    const params = currentUrl[1] ? currentUrl[1].split('&').reduce((prev, curr) => {
      const param = curr.split('=');
      prev[decodeURIComponent(param[0])] = decodeURIComponent(param[1]);
      return prev;
    }, {}) : {};

    const isSearchUsed = filterGroup.query?.length > 2 || !!filterGroup.filters.subCategoryId
      || !!filterGroup.filters.categoryId || !!filterGroup.filters.supplierId || !!filterGroup.filters.tradeMark;

    if (!isSearchUsed) {
      this.areAdditionalFiltersEnabled = false;
      this._initSearchUsed();
      this._initShowClearAllFilters();
      return;
    }

    this.isLoading = true;
    this.areAdditionalFiltersEnabled = true;

    this.request = {
      query: params['q'] || '',
      filters: this._getRequestParams(catId, params),
      size: this.pageSize,
      ...(this.sort && { sort: this.sort }),
      ...(this.page && { page: this.page }),
    };

    this._productService.searchProductOffers(this.request)
      .subscribe((productOffers) => {
        this.productOffersList = productOffers;
        this.productOffers = this.productOffersList._embedded.productOffers;
        this.productsTotal = this.productOffersList.page.totalElements;

        this.summaryFeaturesData = {
          hasProducts: this.productsTotal > 0,
          featuresQueries: this.filters?.features,
          values: this.productOffersList._embedded.summary?.features
        };

        this._initSearchUsed();
        this._initShowClearAllFilters();

        this._searchResultsService.scrollCommandChanges$.next('stand');
        this.isLoading = false;

      }, (err) => {
        this.isLoading = false;
        this._notificationsService.error(err);
      });
  }

  navigateInCategoryRoute(filterGroup: AllGroupQueryFiltersModel): void {
    const categoryId = filterGroup.filters?.categoryId || null;
    const page = this._activatedRoute.snapshot.queryParamMap.get('page');
    const pos = this._activatedRoute.snapshot.queryParamMap.get('pos');
    const sort = this._activatedRoute.snapshot.queryParamMap.get('sort');

    const navigationExtras: NavigationExtras = {
      queryParams: {
        ...queryParamsForProductsFrom(filterGroup),
        ...(this._activatedRoute.snapshot.queryParamMap.has('page') && { page }),
        ...(this._activatedRoute.snapshot.queryParamMap.has('pos') && { pos }),
        ...(this._activatedRoute.snapshot.queryParamMap.has('sort') && { sort }),
      },
      queryParamsHandling: !this.isUrlInitiallyLoaded ? 'merge' : null,
    };

    this.isUrlInitiallyLoaded = true;
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
      this.isLoading = true;

      this._productService.searchProductOffers(this.request)
        .subscribe((productOffers) => {
            this.productOffersList = productOffers;
            this.productOffers.push(...this.productOffersList._embedded.productOffers);
            this.productsTotal = this.productOffersList.page.totalElements;
            this.unlocked = true;
            this.isLoading = false;
          },
          (err) => {
            this.unlocked = true;
            this.isLoading = false;
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

  changeSortingAndRefresh(sort: SortModel): void {
    this.isLoading = true;
    this.sort = sort;
    const queryParamsListToRemove = [...this.utmTags, 'page', 'pos'];
    const currentUrl = this._location.path().split('?');
    const categoryId = currentUrl[0]?.split('/')[2];

    const params: any = currentUrl[1] ? currentUrl[1].split('&').reduce((prev, curr) => {
      const param = curr.split('=');
      if (!queryParamsListToRemove.includes(decodeURIComponent(param[0]))) {
        prev[decodeURIComponent(param[0])] = decodeURIComponent(param[1]);
      }
      return prev;
    }, {}) : {};

    params.sort = sort;

    this._location.go(`/category${categoryId ? `/${categoryId}` : ''}`, this._paramsToString(params));

    this.request = {
      query: params['q'] || '',
      filters: this._getRequestParams(categoryId, params),
      size: this.pageSize,
      sort: this.sort,
    };

    this._productService.searchProductOffers(this.request)
      .subscribe((productOffers) => {
        this.productOffersList = productOffers;
        this.productOffers = this.productOffersList._embedded.productOffers;
        this.productsTotal = this.productOffersList.page.totalElements;

        this.summaryFeaturesData = {
          hasProducts: this.productsTotal > 0,
          featuresQueries: this.filters?.features,
          values: this.productOffersList._embedded.summary?.features
        };

        this.isLoading = false;

      }, (err) => {
        this.isLoading = false;
        this._notificationsService.error(err);
      });
  }

  private _init(): void {
    let categoryId = '';
    this.urlSubscription = combineLatest([
      this._activatedRoute.params,
      this._activatedRoute.queryParams
    ]).pipe(
      tap(() => {
        const paramMap = this._activatedRoute.snapshot.paramMap;
        const queryParamMap = this._activatedRoute.snapshot.queryParamMap;
        this._spinnerService.show();
        this._setFilters(paramMap, queryParamMap);
        this._setAdditionalFiltersVisibility(paramMap, queryParamMap);
        this._setSorting(queryParamMap);
        this._initShowClearAllFilters();
        this._initSearchUsed();

        this._searchResultsService.searchingResultsChanges$.next(true);

        categoryId = paramMap.get('id');
        this.page = +queryParamMap.get('page') || 0;
        this.pos = +queryParamMap.get('pos') || 0;

        this.request = {
          query: queryParamMap.get('q') || '',
          filters: this._filtersFrom(paramMap, queryParamMap),
          size: this.pageSize,
          ...(this.sort && { sort: this.sort }),
          ...(this.page && { page: this.page }),
        };
      }),
      switchMap(() => {
        return this._categoryService.getCategoriesTree().pipe(
          filter((res) => !!res)
        );
      }),
      switchMap(() => {
        return defer(() => {
          return categoryId ? this._categoryService.getCategory(categoryId) : of(null)
        }).pipe(
          tap((category) => {
            this.category = category;
          })
        )
      }),
      filter(() => {
        const pass = !!categoryId || this.isSearchUsed;
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
      this.summaryFeaturesData = {
        hasProducts: this.productsTotal > 0,
        featuresQueries: this.filters?.features,
        values: this.productOffersList._embedded.summary?.features
      };

      if (this._activatedRoute.snapshot.queryParamMap.has('pos')) {
        this._searchResultsService.scrollCommandChanges$.next('scroll');

      } else {
        this._searchResultsService.scrollCommandChanges$.next('stand');

      }
    }, (err) => {
      this._spinnerService.hide();
      this._notificationsService.error(err);
    });
  }

  private _getRequestParams(categoryId: string, params: any) {
    return {
      ...('supplierId' in params && { supplierId: params['supplierId'] }),
      ...('tradeMark' in params && { tradeMark: params['tradeMark'] }),
      ...('isDelivery' in params && { isDelivery: params['isDelivery'] !== 'false' }),
      ...('isPickup' in params && { isPickup: params['isPickup'] !== 'false' }),
      ...('inStock' in params && { inStock: params['inStock'] === 'true' }),
      ...('withImages' in params && { withImages: params['withImages'] === 'true' }),
      ...('hasDiscount' in params && { hasDiscount: params['hasDiscount'] === 'true' }),
      ...('priceFrom' in params && { priceFrom: +params['priceFrom'] }),
      ...('priceTo' in params && { priceTo: +params['priceTo'] }),
      ...('features' in params && { features: params['features'] }),
      ...(categoryId && { categoryId: categoryId }),
      ...('subCategoryId' in params && { categoryId: params['subCategoryId'] }),
    };
  }

  private _setFilters(paramMap: Params, queryParamMap: Params) {
    this.query = queryParamMap?.has('q') ? queryParamMap.get('q') : '';
    this.filters = this._filtersFrom(paramMap, queryParamMap, true);
  }

  private _filtersFrom(paramMap, queryParamMap, hasSubCategoryId = false) {
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
      ...(hasSubCategoryId && queryParamMap.has('subCategoryId') && { subCategoryId: queryParamMap.get('subCategoryId') }),
      ...(!hasSubCategoryId && queryParamMap.has('subCategoryId') && { categoryId: queryParamMap.get('subCategoryId') }),
    };
  }

  private _setAdditionalFiltersVisibility(paramMap: Params, queryParamMap: Params) {
    if (paramMap.get('id')) {
      this.areAdditionalFiltersEnabled = true;
    } else {
      if (queryParamMap.get('q') && queryParamMap.get('q').length > 2) {
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

  private _initShowClearAllFilters() {
    this.showClearAllFilters = !!this.category || !!Object.keys(queryParamsForProductsFrom({ filters: this.filters })).length;
  }

  private _initSearchUsed() {
    this._isSearchUsed = this.query?.length > 2 || !!this.filters.subCategoryId || !!this.filters.categoryId || !!this.filters.supplierId || !!this.filters.tradeMark;
  }

  private _changeQueryParamsPagePosInUrl(page: number, pos: number) {
    let url;

    const currentUrl = this._location.path().split('?');
    const params = currentUrl[1] ? currentUrl[1].split('&').reduce((prev, curr) => {
      const param = curr.split('=');
      prev[decodeURIComponent(param[0])] = decodeURIComponent(param[1]);
      return prev;
    }, {}) : {};

    if (page) {
      if ('page' in params) {
        const params = new Map([['page', page], ['pos', pos]]);
        url = updateUrlParameters(this._location.path(), params);
      } else {
        url = removeURLParameters(this._location.path(), 'pos');
        const params = new Map([['page', page], ['pos', pos]]);
        url = addURLParameters(url, params);
      }
      this._location.replaceState(url);
    } else if (!page && pos > 3) {
      if ('pos' in params) {
        const params = new Map([['pos', pos]]);
        url = removeURLParameters(this._location.path(), 'page');
        url = updateUrlParameters(url, params);
      } else {
        const params = new Map([['pos', pos]]);
        url = addURLParameters(this._location.path(), params);
      }
      this._location.replaceState(url);
    } else {
      url = removeURLParameters(this._location.path(), 'page', 'pos');
      this._location.replaceState(url);

      if (pos > 0) {
        this._router.navigateByUrl(url, { skipLocationChange: true })
      }
    }
  }

  private _paramsToString(queryParams: any): string {
    return Object.entries(queryParams)
      .map((value) => {
        if (Array.isArray(value[1])) {
          return value[1].map(val => `${value[0]}=${val}`).join('&')
        }
        if (value[1]) {
          return `${value[0]}=${value[1]}`;
        }
      })
      .filter(param => !!param)
      .join('&');
  }
}
