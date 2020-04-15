import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, combineLatest, throwError } from 'rxjs';
import { BreadcrumbsService } from '../../../../components/breadcrumbs/breadcrumbs.service';
import {
  AllGroupQueryFiltersModel,
  BreadcrumbItemModel,
  CategoryModel,
  DefaultSearchAvailableModel,
  NomenclatureCardModel,
} from '#shared/modules/common-services/models';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { CategoryService, LocalStorageService } from '#shared/modules/common-services';
import { ProductService } from '#shared/modules/common-services/product.service';
import { tap, switchMap, catchError } from 'rxjs/operators';

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

  ngOnInit() {}

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  changeQueryParameters(filters: AllGroupQueryFiltersModel) {
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
      }),
      switchMap(([params, queryParams]) => {
        console.log(params.id);
        this.categoryId = params.id;
        return this._categoryService.getCategoryTree(this.categoryId);
      }),
      switchMap((res) => {
        this.categoryModel = res[0];
        this.refreshBreadcrumbs(res);
        return this._productService.searchNomenclatureCards({
          query: this.query,
          categoryId: this.categoryId,
          availableFilters: this.searchFilters,
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
