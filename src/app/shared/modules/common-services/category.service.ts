import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { CategoryModel } from './models';
import { map } from 'rxjs/operators';
import { deepTreeParentsSearch, deepTreeSearch } from '#shared/utils';

@Injectable()
export class CategoryService {
  constructor(private _userService: UserService) {
  }

  getCategoryTree(categoryId: string): Observable<CategoryModel[]> {
    // todo: Метод должен возвращать категории от root до categoryId
    return this.getCategories().pipe(
      map((res) => {
        return deepTreeParentsSearch(res, 'id', categoryId);
      })
    );
  }

  getCategoriesChildren(categoryId: string): Observable<CategoryModel[]> {
    // todo: Метод должен возвращать все следущие подкатегории для запрошенной categoryId
    return this.getCategories().pipe(
      map((res) => {
        const foundCategory = deepTreeSearch(res, 'id', (k, v) => v === categoryId);
        return foundCategory?.children;
      })
    );
  }

  getCategories(): Observable<CategoryModel[]> {
    return this._userService.userCategories$.asObservable();
  }
}
