import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { NomenclatureCardModel } from 'src/app/routes/root/children/products/models';

@Component({
  selector: 'c-nomenclature-card',
  templateUrl: './nomenclature-card.component.html',
  styleUrls: [
    './nomenclature-card.component.scss',
    './nomenclature-card.component-576.scss',
    './nomenclature-card.component-400.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NomenclatureCardComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  @Input() nomenclature: NomenclatureCardModel;

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

}
