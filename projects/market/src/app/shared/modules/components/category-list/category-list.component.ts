import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CategoryModel, CategoryService } from '#shared/modules/common-services';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'my-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: [
    './category-list.component.scss'
  ]
})
export class CategoryListComponent implements OnChanges {

  categories: CategoryModel[];
  @Input() category: CategoryModel;
  @Output() breadcrumbsForCategory: EventEmitter<CategoryModel[]> = new EventEmitter();

  constructor(
    private _categoryService: CategoryService,
    private _router: Router,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this._categoryService.getCategoriesChildren(this.category.id)
      .subscribe((res) => {
        this.categories = res;
      }, (err) => {
        console.error('error', err);
      });
  }

  chooseCategory(category: CategoryModel) {
    this.category = category;
    this._categoryService.getCategoryTree(category.id)
      .subscribe((res) => {
        this.breadcrumbsForCategory.emit(res);
      }, (err) => {
        console.error('error', err);
      });
    this._router.navigate([`./category/${category.id}`]);
  }
}
