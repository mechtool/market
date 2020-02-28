import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'c-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: [
    './product-card.component.scss',
    './product-card.component-576.scss',
    './product-card.component-400.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  @Input() routerLink: string[];
  @Input() imgUrl : string;
  @Input() imgAlt : string;
  @Input() title : string;
  @Input() offersCount : number;
  @Input() price : number;

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

}
