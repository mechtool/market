import { Component, Input } from '@angular/core';
import { CategoryModel } from '#shared/modules/common-services/models';
import { CategoryService, NavigationService, NotificationsService, UserService } from '#shared/modules/common-services';
import { take } from 'rxjs/operators';
import { defer } from 'rxjs';

@Component({
  selector: 'market-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss', './category-list.component-768.scss'],
})
export class CategoryListComponent {
  categories: CategoryModel[];
  private _category: CategoryModel;

  @Input() set category(val: CategoryModel) {
    this._category = val;
    defer(() => {
      return this._category?.id ? this._categoryService.getCategoriesChildren(this._category.id) : this._userService.categories$;
    })
      .pipe(take(1))
      .subscribe(
        (categories) => {
          this.categories = categories;
        },
        (err) => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );
  }

  get category() {
    return this._category;
  }

  constructor(
    private _categoryService: CategoryService,
    private _notificationsService: NotificationsService,
    private _navigationService: NavigationService,
    private _userService: UserService,
  ) {}

  goToCategory(id: string, event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this._navigationService.navigateReloadable(['./category', id]);
  }
}
