import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CategoryModel } from '#shared/modules/common-services/models';
import { CategoryService, NotificationsService } from '#shared/modules/common-services';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: [
    './category-list.component.scss'
  ]
})
export class CategoryListComponent implements OnChanges {
  categories: CategoryModel[];
  @Input() category: CategoryModel;

  constructor(
    private _categoryService: CategoryService,
    private _notificationsService: NotificationsService,
    private _router: Router,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._categoryService.getCategoriesChildren(this.category.id)
      .subscribe(
        (categories) => {
          this.categories = categories;
        },
        (err) => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        });
  }

  chooseCategory(category: CategoryModel) {
    this.category = category;
    this._router.navigate([`./category/${category.id}`]);
  }
}
