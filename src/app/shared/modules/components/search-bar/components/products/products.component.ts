import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { SuggestionProductItemModel, SuggestionCategoryItemModel } from '../../../../common-services/models';

@Component({
  selector: 'my-search-bar-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarProductsComponent implements OnInit, OnDestroy {
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
