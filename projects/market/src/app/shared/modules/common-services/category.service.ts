import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserService } from './user.service';
import { CategoryModel, CategoryRequestModel } from './models';
import { filter, map } from 'rxjs/operators';
import { deepTreeParentsSearch, deepTreeSearch, getFlatPropertyArray } from '#shared/utils';
import { BNetService } from './bnet.service';
import { BannerItemModel } from '#shared/modules/components/banners/models/banner-item.model';
import { categoryPromotion } from '#environments/promotions';

const CATEGORY_OTHER = '6341';

@Injectable()
export class CategoryService {
  categoryPromos: {
    [id: string]: BannerItemModel[];
  }[] = [];
  categoryIdsPopularEnabled = ['1', '616', '651', '3321', '3349', '5681'];

  constructor(private _bnetService: BNetService, private _userService: UserService) {
    this._init();
  }

  private _init() {
    this._setPromo();
  }

  getCategory(categoryId: string): Observable<CategoryModel> {
    if (categoryId !== CATEGORY_OTHER) {
      return this.getCategories().pipe(
        map((res) => {
          return deepTreeSearch(res, 'id', (k, v) => v === categoryId);
        }),
      );
    }
    return of(null);
  }

  getCategoryTree(categoryId: string): Observable<CategoryModel[]> {
    if (categoryId !== CATEGORY_OTHER) {
      return this.getCategories().pipe(
        map((res) => {
          return deepTreeParentsSearch(res, 'id', categoryId);
        }),
      );
    }
    return this.emptyCategory();
  }

  getCategoriesChildren(categoryId: string): Observable<CategoryModel[]> {
    if (categoryId !== CATEGORY_OTHER) {
      return this.getCategories().pipe(
        map((res) => {
          const foundCategory = deepTreeSearch(res, 'id', (k, v) => v === categoryId);
          return foundCategory?.children;
        }),
      );
    }
    return this.emptyCategory();
  }

  getAllSupplierCategories(query?: CategoryRequestModel): Observable<CategoryModel[]> {
    return this._bnetService.getCategories(query).pipe(
      map((res) => {
        return res.categories;
      }),
    );
  }

  getCategoryBannerItems(categoryId: string): Observable<BannerItemModel[]> {
    return of(this.categoryPromos[categoryId] || null);
  }

  getCategories(): Observable<CategoryModel[]> {
    return this._userService.categories$.pipe(filter((res) => !!res));
  }

  private _setPromo() {
    Object.keys(categoryPromotion).forEach((categoryId) => {
      this.categoryPromos[categoryId] = categoryPromotion[categoryId];
      if (categoryId) {
        this.getCategoriesChildren(categoryId).subscribe((cat) => {
          const childCategoriesIds = getFlatPropertyArray(cat);
          childCategoriesIds.forEach((childCategoryId) => {
            this.categoryPromos[childCategoryId] = categoryPromotion[categoryId];
          });
        });
      }
    });
  }

  private emptyCategory(): Observable<CategoryModel[]> {
    return of([]);
  }
}
