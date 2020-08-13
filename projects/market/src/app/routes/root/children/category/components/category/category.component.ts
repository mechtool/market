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
} from '#shared/modules/common-services';
import { catchError, switchMap } from 'rxjs/operators';
import { queryParamsWithoutCategoryIdFrom } from '#shared/utils';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent {
  categoryModel: CategoryModel;
  query = '';
  categoryId: string;
  filters: DefaultSearchAvailableModel;
  productOffersList: ProductOffersListResponseModel;
  productOffers: ProductOffersModel[];
  productsTotal: number;
  sort: SortModel;
  isLoadingProducts = false;
  page: number;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _productService: ProductService,
    private _categoryService: CategoryService,
    private _localStorageService: LocalStorageService,
    private _notificationsService: NotificationsService,
  ) {
    this._init();
  }

  queryParametersChange(filters: AllGroupQueryFiltersModel) {
    this._localStorageService.putSearchText(filters.query);
    const categoryId = filters.filters?.categoryId || this.categoryId;
    const params = queryParamsWithoutCategoryIdFrom(filters);
    this._router.navigate([`/category/${categoryId}`], {
      queryParams: params,
    });
  }

  loadProducts(nextPage: number) {
    if (nextPage === (this.productOffersList.page.number + 1) && nextPage < this.productOffersList.page.totalPages) {
      this.page = nextPage;
      this.isLoadingProducts = true;

      this._productService.searchProductOffers({
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
            this.isLoadingProducts = false;
          },
          (err) => {
            this.isLoadingProducts = false;
            this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
          });
    }
  }

  cityChange(isChanged: boolean) {
    if (isChanged) {
      this._init();
    }
  }

  private _init(): void {
    combineLatest([
      this._activatedRoute.params,
      this._activatedRoute.queryParams,
    ])
      .pipe(
        switchMap(([params, queryParams]) => {
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

          return this._categoryService.getCategoryTree(this.categoryId);
        }),
        switchMap((categoryModel) => {
          this.categoryModel = categoryModel.find(category => category.id === this.categoryId);
          return this._productService.searchProductOffers({
            query: this.query,
            filters: this.filters,
            sort: this.sort,
          });
        }),
        catchError((err) => {
          return throwError(err);
        })
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
        }
      );
  }
}
