import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from '#shared/modules/common-services/local-storage.service';
import { DefaultSearchAvailableModel } from '#shared/modules/common-services/models/default-search-available.model';
import { ActivatedRoute, NavigationEnd, NavigationStart, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { unsubscribeList } from '#shared/utils';
import { combineLatest, defer, forkJoin, from, of, Subscription, zip } from 'rxjs';
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
import { filter, map, skip, switchMap, take, tap } from 'rxjs/operators';

const PAGE_SIZE = 30;

@Component({
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnDestroy {
  id = Math.random();
  category: CategoryModel = null;
  filters: DefaultSearchAvailableModel;
  query: string;
  isFilterCollapsed = false;
  bannerItems: BannerItemModel[];

  productOffersList: ProductOffersListResponseModel;
  productOffers: ProductOffersModel[];
  summaryFeaturesDate: any;
  productsTotal: number;
  sort: SortModel | any;
  page = 0;

  areAdditionalFiltersEnabled = false;

  private _isPopularProductsShown = false;

  get isNotSearchUsed(): boolean {
    const queryParamsToCheck = ['q', 'supplierId', 'tradeMark', 'inStock', 'withImages', 'hasDiscount', 'features', 'priceFrom', 'priceTo'];
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

  req: any = null;
  scrollPosition: number;

  urlSubscription: Subscription;

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
    this._handleNavigationForStoringScrollPosition();
    this._init();
  }


  ngOnDestroy() {
    unsubscribeList([this.urlSubscription]);
  }

  private _handleNavigationForStoringScrollPosition() {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        skip(1),
        take(2),
      )
      .subscribe((event) => {
        if (!window['categoryScrollPosition']) {
          window['categoryScrollPosition'] = window.scrollY;
        }
      });

    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        take(2),
      )
      .subscribe((event: NavigationStart) => {
        if (event.navigationTrigger === 'popstate') {
          window['isHistoryBack'] = true;
        }
        if (event.navigationTrigger !== 'popstate') {
          window['isHistoryBack'] = false;
        }
      });
  }

  private _getRequestFilters(paramMap, queryParamMap) {
    const reqFilters = {
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
    return reqFilters;
  }


  private _init(): void {
    let categoryId = '';
    this.urlSubscription = combineLatest([this._activatedRoute.paramMap, this._activatedRoute.queryParamMap]).pipe(
      tap(() => {
        this._spinnerService.show();

        const paramMap = this._activatedRoute.snapshot.paramMap;
        const queryParamMap = this._activatedRoute.snapshot.queryParamMap;

        this._setFilters(paramMap, queryParamMap);
        this._setAdditionalFiltersVisibility(paramMap, queryParamMap);
        this._setSorting(queryParamMap);
        this._setScrollPosition();

        categoryId = paramMap.get('id');
        this.page = +queryParamMap.get('page') || 0;
        this.req = {
          query: queryParamMap.get('q') || '',
          filters: this._getRequestFilters(paramMap, queryParamMap),
          size: PAGE_SIZE,
          ...(this.sort && { sort: this.sort }),
          ...(this.page && { page: this.page }),
        };
      }),
      switchMap((res) => {
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
      filter((res) => {
        const pass = !!categoryId || !this.isNotSearchUsed;
        if (!pass) {
          this._spinnerService.hide();
        }
        return pass;
      }),
      switchMap(() => {
        const searchProductRequests$ = Array.from(Array(this.page + 1).keys()).map((n) => {
          return this._productService.searchProductOffers({ ...this.req, page: n });
        });

        const req$ = forkJoin(searchProductRequests$).pipe(
          map((res: ProductOffersListResponseModel[]) => {
            const productOffers = [];
            res.forEach((item) => {
              productOffers.push(...item._embedded.productOffers);
            });
            const x = {
              _embedded: {
                productOffers,
              },
              page: {
                totalElements: res[0].page.totalElements,
                totalPages: res[0].page.totalPages,
                number: searchProductRequests$.length,
              },
            };
            return x;
          }),
        );

        return defer(() => {
          return this.page === 0 ? this._productService.searchProductOffers(this.req) : req$;
        });
      })
    ).subscribe((productOffers) => {
      this._spinnerService.hide();

      this.productOffersList = productOffers as ProductOffersListResponseModel;
      this.productOffers = this.productOffersList._embedded.productOffers;
      this.productsTotal = this.productOffersList.page.totalElements;
      this.summaryFeaturesDate = {
        hasProducts: this.productsTotal > 0,
        featuresQueries: this.filters?.features,
        values: this.productOffersList._embedded.summary?.features
      };

    }, (e) => {
      this._spinnerService.hide();
      this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
    });
  }

  private _setFilters(paramMap: Params, queryParamMap: Params) {
    this.query = queryParamMap?.has('q') ? queryParamMap.get('q') : '';
    this.filters = {
      ...(queryParamMap?.has('supplierId') && { supplierId: queryParamMap.get('supplierId') }),
      ...(queryParamMap?.has('tradeMark') && { tradeMark: queryParamMap.get('tradeMark') }),
      ...(queryParamMap?.has('isDelivery') && { isDelivery: queryParamMap.get('isDelivery') !== 'false' }),
      ...(queryParamMap?.has('isPickup') && { isPickup: queryParamMap.get('isPickup') !== 'false' }),
      ...(queryParamMap?.has('inStock') && { inStock: queryParamMap.get('inStock') === 'true' }),
      ...(queryParamMap?.has('withImages') && { withImages: queryParamMap.get('withImages') === 'true' }),
      ...(queryParamMap?.has('hasDiscount') && { hasDiscount: queryParamMap.get('hasDiscount') === 'true' }),
      ...(queryParamMap?.has('features') && { features: queryParamMap.getAll('features') }),
      ...(queryParamMap?.has('priceFrom') && { priceFrom: +queryParamMap.get('priceFrom') }),
      ...(queryParamMap?.has('priceTo') && { priceTo: +queryParamMap.get('priceTo') }),
      ...(queryParamMap?.has('subCategoryId') && { subCategoryId: queryParamMap.get('subCategoryId') }),
      ...(paramMap?.has('id') && { categoryId: paramMap.get('id') }),
    };
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

  private _setSorting(queryParamMap: Params) {
    this.sort = queryParamMap.get('sort') || null;
  }

  private _setScrollPosition() {
    if (window['categoryScrollPosition'] && window['isHistoryBack']) {
      this.scrollPosition = window['categoryScrollPosition'];
      delete window['categoryScrollPosition'];
      delete window['isHistoryBack'];
    } else {
      delete window['categoryScrollPosition'];
      delete window['isHistoryBack'];
    }
  }

  navigateInCategoryRoute(filterGroup: AllGroupQueryFiltersModel): void {
    const categoryId = filterGroup.filters?.categoryId || null;
    const page = this._activatedRoute.snapshot.queryParamMap.get('page');

    const navigationExtras = {
      queryParams: {
        ...queryParamsFromNew(filterGroup),
        ...(this._activatedRoute.snapshot.queryParamMap.has('page') && { page }),
      },
    };
    this._router.navigate(['./category', ...(categoryId ? [categoryId] : [])], navigationExtras);
  }

  loadProducts(params: { fetchable: boolean; newPage: any }): void {
    if (params.newPage !== this.page && params.newPage < this.productOffersList.page.totalPages) {
      this.page = params.newPage;
      this.req = { ...this.req, page: this.page, sort: this.sort, size: 30 };
      this._spinnerService.show();

      defer(() => {
        return !params.fetchable ? of(null) : this._productService.searchProductOffers(this.req);
      }).subscribe(
        (productOffers) => {
          this._spinnerService.hide();
          if (productOffers) {
            this.productOffersList = productOffers;
            this.productOffers.push(...this.productOffersList._embedded.productOffers);
            this.productsTotal = this.productOffersList.page.totalElements;
          }

          let url;
          if (this.page) {
            if (this._activatedRoute.snapshot.queryParamMap.get('page')) {
              url = updateUrlParameter(this._router.url, 'page', this.page);
            } else {
              const hasQueryParams = this._activatedRoute.snapshot.queryParamMap.keys.length;
              url = `${this._router.url}${hasQueryParams ? '&' : '?'}page=${this.page}`;
            }
          } else if (+this.page === 0) {
            const hasQueryParams = this._activatedRoute.snapshot.queryParamMap.keys.length;
            url = removeURLParameter(this._router.url, 'page');
          }
          this._location.go(url);
        },
        () => {
          this._spinnerService.hide();
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
    this.sort = sort;
    this.page = 0;
    let url;
    if (!this.sort) {
      url = removeURLParameter(this._router.url, 'sort');
    }
    if (this.sort) {
      if (this._activatedRoute.snapshot.queryParamMap.get('sort')) {
        url = updateUrlParameter(this._router.url, 'sort', this.sort);
      }
      if (!this._activatedRoute.snapshot.queryParamMap.get('sort')) {
        const hasQueryParams = this._activatedRoute.snapshot.queryParamMap.keys.length;
        url = `${this._router.url}${hasQueryParams ? '&' : '?'}sort=${this.sort}`;
      }
    }
    this._location.go(url);

    this.req = { ...this.req, page: this.page, sort: this.sort, size: 30 };

    this._spinnerService.show();

    this._productService.searchProductOffers(this.req).subscribe(
      (productOffers) => {
        this.productOffersList = productOffers;
        this.productOffers = this.productOffersList._embedded.productOffers;
        this.productsTotal = this.productOffersList.page.totalElements;
        this.summaryFeaturesDate = {
          hasProducts: this.productsTotal > 0,
          featuresQueries: this.filters?.features,
          values: this.productOffersList._embedded.summary?.features
        };
        this._spinnerService.hide();
      },
      (err) => {
        this._spinnerService.hide();
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      },
    );
  }
}

// TODO: перенести в общий блок (main.component.ts)
export function queryParamsFromNew(groupQuery: AllGroupQueryFiltersModel): Params {
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

function updateUrlParameter(url, param, value) {
  const regex = new RegExp(`(${param}=)[^&]+`);
  // tslint:disable-next-line:prefer-template
  return url.replace(regex, '$1' + value);
}

function removeURLParameter(url, parameter) {
  const urlparts = url.split('?');
  if (urlparts.length >= 2) {
    const prefix = `${encodeURIComponent(parameter)}=`;
    const pars = urlparts[1].split(/[&;]/g);

    for (let i = pars.length; i-- > 0;) {
      if (pars[i].lastIndexOf(prefix, 0) !== -1) {
        pars.splice(i, 1);
      }
    }

    return urlparts[0] + (pars.length > 0 ? `?${pars.join('&')}` : '');
  }
  return url;
}
