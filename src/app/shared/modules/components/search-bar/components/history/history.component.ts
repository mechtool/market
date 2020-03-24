import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { SuggestionService } from '../../../../common-services';
import { SuggestionProductItemModel, SuggestionCategoryItemModel } from '../../../../common-services/models';

@Component({
  selector: 'my-search-bar-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarHistoryComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  products: SuggestionProductItemModel[];
  categories: SuggestionCategoryItemModel[];

  constructor(private _suggestionService: SuggestionService) {}

  ngOnInit() {
    this._suggestionService.getHistoricalSuggestions()
      .subscribe((res) => {
        this.products = res.products;
        this.categories = res.categories;
      }, (err) => {
        console.log('error');
      });
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

}
