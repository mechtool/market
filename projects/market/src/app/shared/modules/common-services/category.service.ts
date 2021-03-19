import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { CategoryModel, CategoryRequestModel, CategoryResponseModel } from './models';
import { catchError, map, tap } from 'rxjs/operators';
import {
  convertListToTree,
  deepTreeParentsSearch,
  deepTreeSearch,
  getFlatObjectArray,
  getFlatPropertyArray
} from '#shared/utils';
import { BNetService } from './bnet.service';
import { BannerItemModel } from '#shared/modules/components/banners/models/banner-item.model';
import { categoryPromotion } from '#environments/promotions';

const CATEGORY_OTHER = '6341';

@Injectable()
export class CategoryService {
  private _categoryTree$: BehaviorSubject<CategoryModel[]> = new BehaviorSubject(null);
  private _categoryList$: BehaviorSubject<CategoryModel[]> = new BehaviorSubject(null);
  private categoryIdsForPopularProducts = ['1', '616', '651', '3321', '3349', '5681'];
  private categoryPromos: {
    [id: string]: BannerItemModel[];
  }[] = [];

  constructor(private _bnetService: BNetService) {
    this._setCategoryPromotion();
  }

  updateCategories(): Observable<any> {
    return this._bnetService.getCategories().pipe(
      catchError(() => {
        this._categoryTree$.next(null);
        this._categoryList$.next(null);
        return throwError(null);
      }),
      tap((res: CategoryResponseModel) => {
        this._categoryList$.next(res.categories);
        const tree = convertListToTree(res.categories).filter((category) => !!category);
        this._categoryTree$.next(tree);
      }),
    );
  }

  getCategoriesList(): Observable<CategoryModel[]> {
    return this._categoryList$.asObservable();
  }

  getCategoriesTree(): Observable<CategoryModel[]> {
    return this._categoryTree$.asObservable();
  }

  getCategoryTree(categoryId: string): Observable<CategoryModel[]> {
    if (categoryId !== CATEGORY_OTHER) {
      return this.getCategoriesTree().pipe(
        map((res) => {
          return deepTreeParentsSearch(res, 'id', categoryId);
        }),
      );
    }
    return of([]);
  }

  getCategory(categoryId: string): Observable<CategoryModel> {
    if (categoryId && categoryId !== CATEGORY_OTHER) {
      return this.getCategoriesTree().pipe(
        map((categories) => {
          return deepTreeSearch(categories, 'id', (k, v) => v === categoryId);
        }),
      );
    }
    return of(null);
  }

  getChildrenTreeOfCategory(categoryId: string): Observable<CategoryModel[]> {
    if (categoryId !== CATEGORY_OTHER) {
      return this.getCategoriesTree()
        .pipe(
          map((categories) => {
            if (categories) {
              const foundCategory = deepTreeSearch(categories, 'id', (k, v) => v === categoryId);
              return foundCategory?.children;
            }
            return []
          }),
        );
    }
    return of([]);
  }

  getChildrenListOfCategory(categoryId: string): Observable<CategoryModel[]> {
    return this.getChildrenTreeOfCategory(categoryId).pipe(
      map((childrenCategory) => {
        return getFlatObjectArray(childrenCategory);
      }),
    );
  }

  getSupplierCategoriesList(query: CategoryRequestModel): Observable<CategoryModel[]> {
    return this._bnetService.getCategories(query).pipe(
      map((res) => {
        return res.categories;
      }),
    );
  }

  getCategoryBannerItems(categoryId: string): Observable<BannerItemModel[]> {
    return of(this.categoryPromos[categoryId] || null);
  }

  isCategoryPopularProducts(categoryId): Observable<boolean> {
    return of(this.categoryIdsForPopularProducts.includes(categoryId));
  }

  private _setCategoryPromotion() {
    Object.keys(categoryPromotion).forEach((categoryId) => {
      this.categoryPromos[categoryId] = categoryPromotion[categoryId];
      if (categoryId) {
        this.getChildrenTreeOfCategory(categoryId).subscribe((cat) => {
          const childCategoriesIds = getFlatPropertyArray(cat);
          childCategoriesIds.forEach((childCategoryId) => {
            this.categoryPromos[childCategoryId] = categoryPromotion[categoryId];
          });
        });
      }
    });
  }
}
