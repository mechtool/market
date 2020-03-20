import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { SuggestionProductItemModel, SuggestionCategoryItemModel } from '#shared/modules/common-services/models';
import { SuggestionService } from '../../../../../../services';

@Component({
  selector: 'my-main-search-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainSearchHistoryComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  products: SuggestionProductItemModel[];
  categories: SuggestionCategoryItemModel[];

  constructor(private _suggestionService: SuggestionService) {}

  ngOnInit() {
    this._suggestionService.getHistoricalSuggestions()
      .subscribe((res) => {
        this.products = res.products;
        this.categories = res.categories;
      });
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

}
