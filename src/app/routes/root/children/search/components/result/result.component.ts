import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { ProductService } from '#shared/modules/common-services/product.service';
import { NomenclatureCardModel } from '#shared/modules/common-services/models';

@Component({
  selector: 'my-search-result',
  templateUrl: './result.component.html',
  styleUrls: [
    './result.component.scss',
    './result.component-768.scss',
    './result.component-576.scss',
  ],
})
export class SearchResultComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  @Input() nomenclatures: NomenclatureCardModel[];
  @Input() totalNomenclaturesCount: number;

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }


}
