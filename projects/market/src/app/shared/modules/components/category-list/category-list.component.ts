import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CategoryModel } from '#shared/modules/common-services/models';
import { CategoryService, NavigationService } from '#shared/modules/common-services';
import { defer } from 'rxjs';

@Component({
  selector: 'market-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss', './category-list.component-768.scss'],
})
export class CategoryListComponent implements OnChanges {
  categories: CategoryModel[];
  @Input() rootCategoryId: string;
  @Input() rootCategoryName: string;

  constructor(
    private _categoryService: CategoryService,
    private _navigationService: NavigationService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    defer(() => {
      return this.rootCategoryId
        ? this._categoryService.getChildrenTreeOfCategory(this.rootCategoryId)
        : this._categoryService.getCategoriesTree();

    }).subscribe((categories) => {
        this.categories = categories;
      }
    );
  }

  goToCategory(id: string, event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this._navigationService.navigateReloadable(['./category', id]);
  }
}
