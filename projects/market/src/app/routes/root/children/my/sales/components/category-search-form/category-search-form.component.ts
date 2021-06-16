import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '#shared/modules';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { Subscription } from 'rxjs';
import { unsubscribeList } from '#shared/utils';

@Component({
  templateUrl: './category-search-form.component.html',
  styleUrls: [
    './category-search-form.component.scss',
    './category-search-form.component-576.scss',
  ],
})
export class CategorySearchFormComponent implements OnDestroy {
  form: FormGroup;
  categoryTree: NzTreeNodeOptions[];

  @Output() categoryChange: EventEmitter<any> = new EventEmitter();

  private _categoryNameSubscription: Subscription;
  private readonly treeWithAllCategories: NzTreeNodeOptions[];

  constructor(
    private _fb: FormBuilder,
    private _categoryService: CategoryService,
  ) {
    this.form = this._fb.group({
      categoryId: this._fb.control(null, [Validators.required]),
      categoryName: this._fb.control(null, [Validators.required]),
    });

    this.treeWithAllCategories = this._categoryService.get1CnCategoriesTree();
    this.categoryTree = this.treeWithAllCategories;

    this._watchCategoryNameValueChanges();
  }

  ngOnDestroy(): void {
    unsubscribeList([this._categoryNameSubscription]);
  }

  save() {
    this.categoryChange.emit({
      categoryId: this.form.get('categoryId').value,
      categoryName: this.form.get('categoryName').value,
    });
  }

  clickOnCategory($event: NzFormatEmitEvent) {
    if ($event.node.isSelectable) {
      this.form.patchValue({
        categoryId: $event.node.key,
        categoryName: $event.node.title,
      }, { emitEvent: false, onlySelf: false });
    }
  }

  private _watchCategoryNameValueChanges() {
    this._categoryNameSubscription = this.form.controls.categoryName.valueChanges
      .subscribe((val) => {
        if (val.length > 3) {
          this.categoryTree = this._filterTreeData(this.treeWithAllCategories, val.toUpperCase());
        } else {
          this.categoryTree = this.treeWithAllCategories;
        }
      });
  }

  private _filterTreeData(data: NzTreeNodeOptions[], value: string): NzTreeNodeOptions[] {
    const _filter = (node: NzTreeNodeOptions, result: NzTreeNodeOptions[]) => {
      if (node.title.toUpperCase().search(value) !== -1) {
        node.expanded = true;
        node.children?.forEach(n => n.expanded = true);
        result.push(node);
        return result;
      }

      if (node.children?.length) {
        const nodes = node.children.reduce((a, b) => _filter(b, a), [] as NzTreeNodeOptions[]);
        if (nodes.length) {
          const parentNode = { ...node, children: nodes };
          parentNode.expanded = true;
          result.push(parentNode);
        }
      }
      return result;
    };
    return data.reduce((a, b) => _filter(b, a), [] as NzTreeNodeOptions[]);
  }
}

