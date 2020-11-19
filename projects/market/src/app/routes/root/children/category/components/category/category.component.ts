import { Component } from '@angular/core';
import { combineLatest, throwError } from 'rxjs';
import {
  AllGroupQueryFiltersModel,
  CategoryModel,
  DefaultSearchAvailableModel,
  ProductOffersListResponseModel,
  ProductOffersModel,
  SortModel,
} from '#shared/modules/common-services/models';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CategoryService,
  LocalStorageService,
  NotificationsService,
  ProductService,
  SpinnerService,
} from '#shared/modules/common-services';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { hasRequiredParameters, queryParamsWithoutCategoryIdFrom } from '#shared/utils';
import { BannerItemModel } from '#shared/modules/components/banners/models/banner-item.model';

@Component({
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent {
  category: CategoryModel;
  query = '';
  categoryId: string;
  filters: DefaultSearchAvailableModel;
  productOffersList: ProductOffersListResponseModel;
  productOffers: ProductOffersModel[];
  productsTotal: number;
  sort: SortModel;
  page: number;
  bannerItems: BannerItemModel[];
  isPopularEnabled = false;

  get isNotSearchUsed(): boolean {
    const queryParamsInFilter = ['q', 'supplierId', 'trademark', 'inStock', 'withImages', 'priceFrom', 'priceTo'];
    const queryParamsList = Object.keys(this._activatedRoute.snapshot.queryParams);
    return !queryParamsList.some((queryParam) => queryParamsInFilter.includes(queryParam));
  }

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _productService: ProductService,
    private _categoryService: CategoryService,
    private _localStorageService: LocalStorageService,
    private _notificationsService: NotificationsService,
    private _spinnerService: SpinnerService,
  ) {
    this._init();
  }

  loadProducts(nextPage: number) {
    if (nextPage === this.productOffersList.page.number + 1 && nextPage < this.productOffersList.page.totalPages) {
      this.page = nextPage;
      this._spinnerService.show();

      this._productService
        .searchProductOffers({
          query: this.query,
          filters: this.filters,
          page: nextPage,
          sort: this.sort,
        })
        .subscribe(
          (productOffers) => {
            this.productOffersList = productOffers;
            this.productOffers.push(...this.productOffersList._embedded.productOffers);
            this.productsTotal = this.productOffersList.page.totalElements;
            this._spinnerService.hide();
          },
          (err) => {
            this._spinnerService.hide();
            this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
          },
        );
    }
  }

  changeQueryParamsAndRefresh(groupQuery: AllGroupQueryFiltersModel) {
    this._localStorageService.putSearchText(groupQuery.query);
    const categoryId = groupQuery.filters?.categoryId || this.categoryId;
    this.addOrRemoveSorting(groupQuery);
    const params = queryParamsWithoutCategoryIdFrom(groupQuery);
    this._router.navigate([`/category/${categoryId}`], {
      queryParams: params,
    });
  }

  changeCityAndRefresh(isChanged: boolean) {
    if (isChanged) {
      this._init();
    }
  }

  changeSortingAndRefresh(sort: SortModel) {
    this.sort = sort;
    this.changeQueryParamsAndRefresh({
      query: this.query,
      filters: this.filters,
      sort: this.sort,
    });
  }

  private _init(): void {
    combineLatest([this._activatedRoute.params, this._activatedRoute.queryParams])
      .pipe(
        tap(([params, queryParams]) => {
          this.categoryId = params.categoryId;
          this.query = queryParams.q;
          this.sort = queryParams.sort;
          this.filters = {
            supplierId: queryParams.supplierId,
            trademark: queryParams.trademark,
            isDelivery: queryParams.isDelivery !== 'false',
            isPickup: queryParams.isPickup !== 'false',
            inStock: queryParams.inStock,
            withImages: queryParams.withImages,
            priceFrom: queryParams.priceFrom,
            priceTo: queryParams.priceTo,
            categoryId: this.categoryId,
          };
          this.isPopularEnabled = this._categoryService.categoryIdsPopularEnabled.includes(this.categoryId);
        }),
        switchMap(() => {
          return this._categoryService.getCategoryBannerItems(this.categoryId);
        }),
        tap((bannerItems) => {
          this.bannerItems = bannerItems;
        }),
        switchMap(() => {
          return this._categoryService.getCategory(this.categoryId);
        }),
        switchMap((category) => {
          this.category = category;
          return this._productService.searchProductOffers({
            query: this.query,
            filters: this.filters,
            sort: this.sort,
          });
        }),
        catchError((err) => {
          return throwError(err);
        }),
      )
      .subscribe(
        (productOffers) => {
          this.productOffersList = productOffers;
          this.productOffers = this.productOffersList._embedded.productOffers;
          this.productsTotal = this.productOffersList.page.totalElements;
          this.page = this.productOffersList.page.number;
        },
        (err) => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );
  }

  private addOrRemoveSorting(groupQuery: AllGroupQueryFiltersModel) {
    if (hasRequiredParameters(groupQuery)) {
      groupQuery.sort = this.sort;
    }
  }
}
