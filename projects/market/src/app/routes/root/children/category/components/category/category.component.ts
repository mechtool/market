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
import { queryParamsFrom } from '#shared/utils';
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
  availableFilters: DefaultSearchAvailableModel;
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
    const categoryId = filters.availableFilters?.categoryId || this.categoryId;
    if (filters.availableFilters?.categoryId) {
      // в данном компоненте категория часть пути, а не query string
      filters.availableFilters.categoryId = undefined;
    }
    this._router.navigate([`/category/${categoryId}`], {
      queryParams: queryParamsFrom(filters),
    });
  }

  loadProducts(nextPage: number) {
    if (nextPage === (this.productOffersList.page.number + 1) && nextPage < this.productOffersList.page.totalPages) {
      this.page = nextPage;
      this.isLoadingProducts = true;

      this._productService.searchProductOffers({
        query: this.query,
        availableFilters: this.availableFilters,
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
          this.availableFilters = {
            supplierId: queryParams.supplierId,
            trademark: queryParams.trademark,
            delivery: queryParams.delivery,
            pickup: queryParams.pickup,
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
            availableFilters: this.availableFilters,
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
