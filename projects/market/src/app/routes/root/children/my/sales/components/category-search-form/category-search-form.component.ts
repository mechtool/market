import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '#shared/modules';
import { NzTreeNodeOptions } from 'ng-zorro-antd/core/tree';

@Component({
  templateUrl: './category-search-form.component.html',
  styleUrls: ['./category-search-form.component.scss'],
})
export class CategorySearchFormComponent {
  form: FormGroup;
  categoriesTree: NzTreeNodeOptions[];
  @Output() categoryChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private _fb: FormBuilder,
    private _categoryService: CategoryService,
  ) {
    this.form = this._fb.group({
      categoryId: this._fb.control(null, [Validators.required]),
    });

    this.categoriesTree = this._categoryService.get1CnCategoriesTree();
  }

  save() {
    const category = this._categoryService.get1CnCategory(this.form.controls.categoryId.value);
    this.categoryChange.emit({
      categoryId: category.id,
      categoryName: category.name,
    });
  }
}

