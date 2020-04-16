import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CategoryModel } from '../../common-services/models/category.model';
import { CategoryService } from '../../../modules/common-services/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'my-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: [
    './category-list.component.scss'
  ]
})
export class CategoryListComponent implements OnInit, OnDestroy, OnChanges {

  categories: CategoryModel[];
  @Input() category: CategoryModel;
  @Output() breadcrumbsForCategory: EventEmitter<CategoryModel[]> = new EventEmitter();

  constructor(
    private _categoryService: CategoryService,
    private _router: Router,
  ) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

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
    this.ngOnInit();
  }
}
