import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategoryModel } from '#shared/modules/common-services/models';
import { NotificationsService } from '#shared/modules/common-services';
import { debounceTime, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '.category_desktop',
})
export class SearchBarCategoryDesktopElementDirective {
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '.category_mobile',
})
export class SearchBarCategoryMobileElementDirective {
}

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
  @Input() selectedCategoryIndex: number;
  // tslint:disable-next-line:no-input-rename
  @Input('formGroup') categoryForm: FormGroup;

  @Input() set categories(value: CategoryModel[]) {
    this._categories = value;

    this.categoryChunkSequence$()
      .pipe(
        tap(() => {
          this._cdr.detectChanges();
        }),
      )
      .subscribe(
        (res) => {
        },
        (err) => {
        },
        () => {
          this._scrollToCategory();
          this._cdr.detectChanges();
        },
      );
  }

  constructor(private _notificationsService: NotificationsService, private _fb: FormBuilder, private _cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.categoryForm.controls.categoryName.valueChanges.pipe(debounceTime(3e2)).subscribe((query: string) => {
      this._categories.forEach((categoryItem) => {
        categoryItem.visible = categoryItem.name.toLowerCase().includes(query.toLowerCase());
      });
      this._cdr.detectChanges();
    });
  }

  private categoryChunkSequence$(): Observable<any> {
    return new Observable((subscriber) => {
      const ITEMS_RENDERED_AT_ONCE = 250;
      const INTERVAL_IN_MS = 100;
      let currentIndex = 0;

      const intervalId = setInterval(() => {
        const nextIndex = currentIndex + ITEMS_RENDERED_AT_ONCE;

        for (let n = currentIndex; n < nextIndex; n++) {
          if (n >= this._categories.length) {
            clearInterval(intervalId);
            subscriber.complete();
            break;
          }
          const context = {
            item: this._categories[n],
            index: n,
          };
          this._container.createEmbeddedView(this._template, context);
        }
        currentIndex += ITEMS_RENDERED_AT_ONCE;
        subscriber.next(currentIndex);
      }, INTERVAL_IN_MS);
    });
  }

  private _scrollToCategory(): void {
    if (this.selectedCategoryIndex) {
      setTimeout(() => {
        const categoryElementToScroll = this._container.get(this.selectedCategoryIndex)['rootNodes'][0];
        categoryElementToScroll.scrollIntoView({ block: 'center' });
      }, 0);
    }
  }
}
