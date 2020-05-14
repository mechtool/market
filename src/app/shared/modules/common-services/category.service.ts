import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { UserService } from './user.service';
import { CategoryModel } from './models/category.model';
import { delay, map, catchError } from 'rxjs/operators';
import { deepTreeSearch, deepTreeParentsSearch } from '#shared/utils';

@Injectable()
export class CategoryService {
  constructor(private _userService: UserService) {}

  private readonly rootCategories = [
    {
      id: '1',
      name: 'Компьютеры и связь',
      isLeaf: false,
      products: 10,
      offers: 20,
    },
    {
      id: '5677',
      name: 'Транспорт',
      isLeaf: false,
      products: 1,
      offers: 1,
    },
    {
      id: '6341',
      name: 'Прочее',
      isLeaf: true,
      products: 100,
      offers: 200,
    },
  ];

  private readonly leafCategoriesFor1 = [
    {
      id: '10',
      name: 'Компьютеры',
      isLeaf: false,
      products: 10,
      offers: 20,
    },
    {
      id: '11',
      name: 'Планшеты',
      isLeaf: false,
      products: 10,
      offers: 20,
    },
    {
      id: '12',
      name: 'Мобильные телефоны',
      isLeaf: false,
      products: 10,
      offers: 20,
    },
    {
      id: '13',
      name: 'Радиоустройства',
      isLeaf: false,
      products: 10,
      offers: 20,
    },
    {
      id: '14',
      name: 'Радиостанции',
      isLeaf: false,
      products: 10,
      offers: 20,
    },
    {
      id: '15',
      name: 'Потративные плееры',
      isLeaf: false,
      products: 10,
      offers: 20,
    },
    {
      id: '16',
      name: 'Запчасти для ремонта кинотеаторв',
      isLeaf: false,
      products: 10,
      offers: 20,
    },
    {
      id: '17',
      name: 'Оргтехника и расходные материалы',
      isLeaf: false,
      products: 10,
      offers: 20,
    },
  ];

  private readonly leafCategoriesFor5677 = [
    {
      id: '5681',
      name: 'Авто- и мототранспорт',
      isLeaf: true,
      products: 1,
      offers: 1,
    },
  ];

  private readonly leafCategoriesFor6341 = [
    {
      id: '10001',
      name: 'Сделай сам',
      isLeaf: true,
      products: 1,
      offers: 1,
    },
  ];

  getCategoryTree(categoryId: string): Observable<CategoryModel[]> {
    // todo: Метод должен возвращать категории от root до categoryId
    const categories = [];

    if (categoryId === '1') {
      categories.push(this.rootCategories[0]);
      return of(categories);
    }

    if (categoryId === '5677') {
      categories.push(this.rootCategories[1]);
      return of(categories);
    }

    if (categoryId === '6341') {
      categories.push(this.rootCategories[2]);
      return of(categories);
    }

    if (this.leafCategoriesFor1.some((c) => c.id === categoryId)) {
      categories.push(this.rootCategories[0]);
      return of(
        categories.concat(
          this.leafCategoriesFor1.filter((c) => c.id === categoryId)
        )
      );
    }

    if (this.leafCategoriesFor5677.some((c) => c.id === categoryId)) {
      categories.push(this.rootCategories[1]);
      return of(
        categories.concat(
          this.leafCategoriesFor5677.filter((c) => c.id === categoryId)
        )
      );
    }

    if (this.leafCategoriesFor6341.some((c) => c.id === categoryId)) {
      categories.push(this.rootCategories[2]);
      return of(
        categories.concat(
          this.leafCategoriesFor6341.filter((c) => c.id === categoryId)
        )
      );
    }

    return of([]);
  }

  getCategoriesChildren(categoryId: string): Observable<CategoryModel[]> {
    // todo: Метод должен возвращать все следущие подкатегории для запрошенной categoryId
    if (categoryId === '1') {
      return of(this.leafCategoriesFor1);
    }

    if (categoryId === '5677') {
      return of(this.leafCategoriesFor5677);
    }

    if (categoryId === '6341') {
      return of(this.leafCategoriesFor6341);
    }

    return of([]);
  }

  getCategoryTree2(categoryId: string): Observable<CategoryModel[]> {
    // todo Руслан: Замена для getCategoryTree
    return this.getCategories().pipe(
      map((res) => {
        const foundCategories = deepTreeParentsSearch(res, 'id', categoryId);
        return foundCategories;
      })
    );
  }

  getCategoriesChildren2(categoryId: string): Observable<CategoryModel[]> {
    // todo Руслан: Замена для getCategoriesChildren
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
