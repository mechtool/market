import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategoryModel } from '#shared/modules/common-services/models';
import { NotificationsService } from '#shared/modules/common-services';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'market-search-bar-filter-category',
  templateUrl: './search-bar-filter-category.component.html',
  styleUrls: ['./search-bar-filter-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarFilterCategoryComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef }) private _container: ViewContainerRef;
  @ViewChild('template', { read: TemplateRef }) private _template: TemplateRef<any>;
  private _categories: CategoryModel[];

  @Input() type: 'desktop' | 'mobile';
  // tslint:disable-next-line:no-input-rename
  @Input('formGroup') categoryForm: FormGroup;
  @Input() set categories(value: CategoryModel[]) {
    this._categories = value;
    this._renderCategories();
  }

  get categories(): CategoryModel[] {
    return this._categories;
  }

  constructor(private _notificationsService: NotificationsService, private _fb: FormBuilder, private _cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.categoryForm.controls.categoryName.valueChanges.pipe(debounceTime(3e2)).subscribe((query: string) => {
      this._categories.forEach((categoryItem) => {
        categoryItem.visible = categoryItem.name.toLowerCase().includes(query.toLowerCase());
      });
      this._cdr.detectChanges();
    });
  }

  private _renderCategories() {
    const ITEMS_RENDERED_AT_ONCE = 30;
    const INTERVAL_IN_MS = 30;

    let currentIndex = 0;

    const interval = setInterval(() => {
      const nextIndex = currentIndex + ITEMS_RENDERED_AT_ONCE;

      for (let n = currentIndex; n <= nextIndex; n++) {
        if (n >= this.categories.length) {
          clearInterval(interval);
          break;
        }
        const context = {
          item: this.categories[n],
          index: n,
        };
        this._container.createEmbeddedView(this._template, context);
      }
      currentIndex += ITEMS_RENDERED_AT_ONCE;
      this._cdr.detectChanges();
    }, INTERVAL_IN_MS);
  }
}
