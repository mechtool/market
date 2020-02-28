import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { SuggestResponseItemProductModel, SuggestResponseItemCategoryModel } from 'src/app/routes/root/children/products/models';
import { ProductsService } from 'src/app/routes/root/children/products/services';

@Component({
  selector: 'c-main-search-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainSearchHistoryComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  products: SuggestResponseItemProductModel[];
  categories: SuggestResponseItemCategoryModel[];

  constructor(private _productsService: ProductsService) {}

  ngOnInit() {
    this._productsService.getHistoricalSuggestions()
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
