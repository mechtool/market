import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'my-main-search-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainSearchItemComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  @Input() routerLink: string[];
  @Input() img: string;
  @Input() imgAlt: string;
  @Input() offersCount: string | number;
  @Input() type: string;

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

}
