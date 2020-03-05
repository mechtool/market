import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { SuggestionProductItemModel, SuggestionCategoryItemModel } from '#shared/modules/common-services/models';

@Component({
  selector: 'c-main-search-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainSearchProductsComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  @Input() products: SuggestionProductItemModel[];
  @Input() categories: SuggestionCategoryItemModel[];

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

}
