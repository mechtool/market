import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { CategoryModel, CategoryRequestModel, CategoryResponseModel } from './models';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { convertListToTree, deepTreeParentsSearch, deepTreeSearch, getFlatObjectArray } from '#shared/utils';
import { BNetService } from './bnet.service';

const CATEGORY_OTHER = '6341';

@Injectable()
export class CategoryService {
  private _categoryTree$: BehaviorSubject<CategoryModel[]> = new BehaviorSubject(null);
  private _categoryList$: BehaviorSubject<CategoryModel[]> = new BehaviorSubject(null);

  constructor(private _bnetService: BNetService) {
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
        filter((res) => !!res),
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
}
