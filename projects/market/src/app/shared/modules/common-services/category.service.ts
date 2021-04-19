import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import {
  CategoriesMappingModel,
  Category1cnModel,
  CategoryModel,
  CategoryRequestModel,
  CategoryResponseModel,
  CategoryTreeNodeOptionsModel
} from './models';
import { catchError, filter, map, tap } from 'rxjs/operators';
import {
  convertCategoryListToTree,
  convertListToTree,
  deepTreeParentsSearch,
  deepTreeSearch,
  getFlatObjectArray,
  newTreeData,
} from '#shared/utils';
import { BNetService } from './bnet.service';

const CATEGORY_OTHER = '6341';

@Injectable()
export class CategoryService {
  private _categoryTree$: BehaviorSubject<CategoryModel[]> = new BehaviorSubject(null);
  private _categoryList$: BehaviorSubject<CategoryModel[]> = new BehaviorSubject(null);
  private _1CnCategoriesTree$: BehaviorSubject<CategoryTreeNodeOptionsModel[]> = new BehaviorSubject([]);
  private _1CnCategoriesHashMap$: BehaviorSubject<Map<string, Category1cnModel>> = new BehaviorSubject(null);

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

  upload1CnCategoriesTree(): Observable<any> {
    return this._bnetService.get1CnCategories()
      .pipe(
        catchError(() => {
          this._1CnCategoriesTree$.next([]);
          this._1CnCategoriesHashMap$.next(new Map());
          return throwError(null);
        }),
        tap((res) => {
          if (!this._1CnCategoriesTree$.getValue().length) {
            this._1CnCategoriesTree$.next(convertCategoryListToTree(res.content));
            this._1CnCategoriesHashMap$.next(new Map<string, Category1cnModel>(res.content.map(cat => [cat.id, cat])));
          }
        })
      );
  }

  getCategoriesList(): Observable<CategoryModel[]> {
    return this._categoryList$.asObservable();
  }

  getCategoriesTree(): Observable<CategoryModel[]> {
    return this._categoryTree$.asObservable();
  }

  get1CnCategoriesTree(): CategoryTreeNodeOptionsModel[] {
    return newTreeData(this._1CnCategoriesTree$.getValue());
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

  get1CnCategory(categoryId: string): Category1cnModel {
    return this._1CnCategoriesHashMap$.getValue().get(categoryId);
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

  getCategoriesMapping(organizationId: string): Observable<CategoriesMappingModel> {
    return this._bnetService.getCategoriesMapping(organizationId);
  }

  saveCategoriesMapping(organizationId: string, mapping: CategoriesMappingModel): Observable<any> {
    return this._bnetService.saveCategoriesMapping(organizationId, mapping);
  }
}
