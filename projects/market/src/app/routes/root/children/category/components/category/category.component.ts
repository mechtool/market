import { AfterContentChecked, Component, ElementRef, ViewChild } from '@angular/core';
import { combineLatest, throwError } from 'rxjs';
import {
  AllGroupQueryFiltersModel,
  CategoryModel,
  DefaultSearchAvailableModel,
  SortModel,
} from '#shared/modules/common-services/models';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CategoryService,
  ExternalProvidersService,
  LocalStorageService,
  NotificationsService,
  ProductService,
  SpinnerService,
} from '#shared/modules/common-services';
import { catchError, switchMap } from 'rxjs/operators';
import { hasRequiredParameters, queryParamsWithoutCategoryIdFrom } from '#shared/utils';
import { BannerItemModel } from '#shared/modules/components/banners/models/banner-item.model';
import { BannersComponent } from '#shared/modules/components/banners';
import { MainPopularComponent } from '../../../product';
import { CategoryListComponent } from '#shared/modules/components/category-list';

@Component({
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements AfterContentChecked {
  private sort: SortModel;

  query = '';
  page: number;
  categoryId: string;
  category: CategoryModel;
  isPopularEnabled = false;
  bannerItems: BannerItemModel[];
  popularComponentHeight: number;
  bannersComponentHeight: number;
  categoryListComponentHeight: number;
  filters: DefaultSearchAvailableModel;

  @ViewChild(BannersComponent, { read: ElementRef }) elementBannersComponent: ElementRef;
  @ViewChild(MainPopularComponent, { read: ElementRef }) elementMainPopularComponent: ElementRef;
  @ViewChild(CategoryListComponent, { read: ElementRef }) elementCategoryListComponent: ElementRef;

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
    private _externalProvidersService: ExternalProvidersService,
  ) {
    this._init();
  }

  ngAfterContentChecked(): void {
    this.bannersComponentHeight = this.elementBannersComponent?.nativeElement?.firstElementChild?.offsetHeight;
    this.popularComponentHeight = this.elementMainPopularComponent?.nativeElement?.firstElementChild?.offsetHeight;
    this.categoryListComponentHeight = this.elementCategoryListComponent?.nativeElement?.firstElementChild?.offsetHeight;
  }

  changeQueryParamsAndRefresh(groupQuery: AllGroupQueryFiltersModel) {
    this._localStorageService.putSearchText(groupQuery.query);
    const categoryId = groupQuery.filters?.categoryId || this.categoryId;
    this._addOrRemoveSorting(groupQuery);
    this._addPage(groupQuery);
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

  changePage(page: number) {
    this.page = page;
    this.changeQueryParamsAndRefresh({
      query: this.query,
      filters: this.filters,
      sort: this.sort,
      page: this.page,
    });
  }

  private _init(): void {
    combineLatest([this._activatedRoute.params, this._activatedRoute.queryParams])
      .pipe(
        switchMap(([params, queryParams]) => {
          this.categoryId = params.categoryId;
          this.query = queryParams.q;
          this.sort = queryParams.sort;
          this.page = queryParams.page || 0;

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
          return this._categoryService.getCategoryBannerItems(this.categoryId);
        }),
        switchMap((bannerItems) => {
          this.bannerItems = bannerItems;
          return this._categoryService.getCategory(this.categoryId);
        }),
        catchError((err) => {
          return throwError(err);
        }),
      )
      .subscribe((category) => {
          this.category = category;
        },
        (err) => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );
  }

  private _addOrRemoveSorting(groupQuery: AllGroupQueryFiltersModel) {
    if (hasRequiredParameters(groupQuery)) {
      groupQuery.sort = this.sort;
    }
  }

  private _addPage(groupQuery: AllGroupQueryFiltersModel) {
    groupQuery.page = this.page;
  }
}
