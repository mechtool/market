import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { SuggestResponseItemProductModel, SuggestResponseItemCategoryModel } from 'src/app/routes/root/children/products/models';

@Component({
  selector: 'c-main-search-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainSearchProductsComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  @Input() products: SuggestResponseItemProductModel[];
  @Input() categories: SuggestResponseItemCategoryModel[];

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

}
