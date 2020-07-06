import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject, throwError } from 'rxjs';
import { BreadcrumbsService } from '../../../../components/breadcrumbs/breadcrumbs.service';
import {
  AllGroupQueryFiltersModel,
  BreadcrumbItemModel,
  CategoryModel,
  DefaultSearchAvailableModel,
  ProductOffersListResponseModel,
  ProductOffersModel,
  SortModel,
} from '#shared/modules/common-services/models';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService, LocalStorageService, } from '#shared/modules/common-services';
import { ProductService } from '#shared/modules/common-services/product.service';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
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
    private _breadcrumbsService: BreadcrumbsService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _productService: ProductService,
    private _categoryService: CategoryService,
    private _localStorageService: LocalStorageService
  ) {
    this._init();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  queryParametersChange(filters: AllGroupQueryFiltersModel) {
    this._localStorageService.putSearchText(filters.query);
    const availableFilters = filters.availableFilters;
    this._router.navigate([`/category/${this.categoryId}`], {
      queryParams: {
        q: filters.query,
        supplier: availableFilters.supplier,
        trademark: availableFilters.trademark,
        deliveryMethod: availableFilters.deliveryMethod,
        delivery: availableFilters.delivery,
        pickup: availableFilters.pickup,
        inStock: availableFilters.inStock,
        withImages: availableFilters.withImages,
        priceFrom: availableFilters.priceFrom,
        priceTo: availableFilters.priceTo,
        sort: filters.sort,
      },
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
            console.error('error', err);
          });
    }
  }

  refreshBreadcrumbs($event: CategoryModel[]): void {
    const breadcrumbs = $event.reduce(
      (accum, curr) => {
        accum.push({
          label: curr.name,
          routerLink: `/category/${curr.id}`,
        });
        return accum;
      },
      <BreadcrumbItemModel[]>[
        {
          label: 'Каталог',
        },
      ]
    );
    this._setBreadcrumbs(breadcrumbs);
  }

  private _init(): void {
    combineLatest([
      this._activatedRoute.params,
      this._activatedRoute.queryParams,
    ])
      .pipe(
        switchMap(([params, queryParams]) => {
          this.categoryId = params.id;
          this.query = queryParams.q;
          this.sort = queryParams.sort;
          this.availableFilters = {
            supplier: queryParams.supplier,
            trademark: queryParams.trademark,
            deliveryMethod: queryParams.deliveryMethod,
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
          this.refreshBreadcrumbs(categoryModel);
          return this._productService.searchProductOffers({
            query: this.query,
            availableFilters: this.availableFilters,
            sort: this.sort,
          });
        }),
        catchError((err) => {
          console.error('error', err);
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
          console.error('error', err);
        }
      );
  }

  private _setBreadcrumbs(breadcrumbs: BreadcrumbItemModel[]): void {
    this._breadcrumbsService.setVisible(true);
    this._breadcrumbsService.setItems(breadcrumbs);
  }
}
