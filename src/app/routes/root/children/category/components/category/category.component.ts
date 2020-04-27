import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject, throwError } from 'rxjs';
import { BreadcrumbsService } from '../../../../components/breadcrumbs/breadcrumbs.service';
import {
  AllGroupQueryFiltersModel,
  BreadcrumbItemModel,
  CategoryModel,
  DefaultSearchAvailableModel,
  NomenclatureCardModel,
  SortModel,
} from '#shared/modules/common-services/models';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService, LocalStorageService } from '#shared/modules/common-services';
import { ProductService } from '#shared/modules/common-services/product.service';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Component({
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  categoryModel: CategoryModel;
  query: '';
  categoryId: string;
  searchFilters: DefaultSearchAvailableModel;
  searchedNomenclatures: NomenclatureCardModel[];
  totalSearchedNomenclaturesCount: number;
  sort: SortModel;

  constructor(
    private _breadcrumbsService: BreadcrumbsService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _productService: ProductService,
    private _categoryService: CategoryService,
    private _localStorageService: LocalStorageService,
  ) {
    this._watchUrlChanges();
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
        onlyWithImages: availableFilters.onlyWithImages,
        priceFrom: availableFilters.priceFrom,
        priceTo: availableFilters.priceTo,
        sort: filters.sort,
      }
    });
  }

  refreshBreadcrumbs($event: CategoryModel[]): void {
    const breadcrumbs = $event.reduce((accum, curr) => {
      accum.push({
        label: curr.name,
        routerLink: `/category/${curr.id}`
      });
      return accum;
    }, <BreadcrumbItemModel[]>[{
      label: 'Категории товаров',
    }]);
    this._setBreadcrumbs(breadcrumbs);
  }

  private _watchUrlChanges(): void {
    combineLatest([
      this._activatedRoute.params,
      this._activatedRoute.queryParams,
    ]).pipe(
      tap(([params, queryParams]) => {
        this.query = queryParams.q;
        this.searchFilters = {
          supplier: queryParams.supplier,
          trademark: queryParams.trademark,
          deliveryMethod: queryParams.deliveryMethod,
          delivery: queryParams.delivery,
          pickup: queryParams.pickup,
          inStock: queryParams.inStock,
          onlyWithImages: queryParams.onlyWithImages,
          priceFrom: queryParams.priceFrom,
          priceTo: queryParams.priceTo,
        };
        this.sort = queryParams.sort;
      }),
      switchMap(([params, queryParams]) => {
        this.categoryId = params.id;
        return this._categoryService.getCategoryTree(this.categoryId);
      }),
      switchMap((res) => {
        // todo: поменять логику когда сделаем дерево категорий
        this.categoryModel = res.find(cat => cat.id === this.categoryId);
        this.refreshBreadcrumbs(res);
        return this._productService.searchNomenclatureCards({
          query: this.query,
          categoryId: this.categoryId,
          availableFilters: this.searchFilters,
          sort: this.sort,
        });
      }),
      catchError((err) => {
        console.error('error', err);
        return throwError(err);
      }),
    ).subscribe((res) => {
      this.searchedNomenclatures = res._embedded.items;
      this.totalSearchedNomenclaturesCount = res.page?.totalElements;
    }, (err) => {
      console.error('error', err);
    });
  }

  private _setBreadcrumbs(breadcrumbs: BreadcrumbItemModel[]): void {
    this._breadcrumbsService.setVisible(true);
    this._breadcrumbsService.setItems(breadcrumbs);
  }
}