import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BreadcrumbsService } from '../../../../components/breadcrumbs/breadcrumbs.service';
import {
  AllGroupQueryFiltersModel,
  BreadcrumbItemModel,
  CategoryModel,
  DefaultSearchAvailableModel,
  NomenclatureCardModel
} from '../../../../../../shared/modules/common-services/models';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService, LocalStorageService } from '../../../../../../shared/modules/common-services';
import { ProductService } from '#shared/modules/common-services/product.service';

@Component({
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  private _breadcrumbItems: BreadcrumbItemModel[];
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
    this._initCategory();
    this._initQueryParams();
    this._searchNomenclatures({
      query: this.query,
      categoryId: this.categoryId,
      availableFilters: this.searchFilters
    });
  }

  ngOnInit() {
  }

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

  refreshBreadcrumbs($event: CategoryModel[]) {
    this._breadcrumbItems = [
      {
        label: 'Категории товаров',
      }
    ];

    $event.forEach((res) => {
      this._breadcrumbItems.push({
        label: res.name,
        routerLink: `/category/${res.id}`
      });
    });

    this._initBreadcrumbs();
  }

  private _initCategory() {
    this._activatedRoute.params.subscribe((res: any) => {
      this.categoryId = res.id;
      this._categoryService.getCategoryTree(this.categoryId)
        .subscribe((categories) => {
          this.categoryModel = categories[0];
          this.refreshBreadcrumbs(categories);
        }, (err) => {
          console.error('error', err);
        });
    }, (err) => {
      console.error('error', err);
    });
  }

  private _initQueryParams() {
    this._activatedRoute.queryParams
      .subscribe((res) => {
        this.query = res.q;
        this.searchFilters = {
          supplier: res.supplier,
          trademark: res.trademark,
          deliveryMethod: res.deliveryMethod,
          delivery: res.delivery,
          pickup: res.pickup,
          inStock: res.inStock,
          onlyWithImages: res.onlyWithImages,
          priceFrom: res.priceFrom,
          priceTo: res.priceTo,
        };
      }, (err) => {
        console.error('error', err);
      });
  }

  private _searchNomenclatures(filters: AllGroupQueryFiltersModel): void {
    this._productService.searchNomenclatureCards(filters)
      .subscribe((res) => {
        this.searchedNomenclatures = res._embedded.items;
        this.totalSearchedNomenclaturesCount = res.page?.totalElements;
      }, (err) => {
        console.error('error', err);
      });
  }

  private _initBreadcrumbs() {
    this._breadcrumbsService.setVisible(true);
    this._breadcrumbsService.setItems(this._breadcrumbItems);
  }
}
