import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BreadcrumbsService } from '../../../../components/breadcrumbs/breadcrumbs.service';

@Component({
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();

  constructor(private _breadcrumbsService: BreadcrumbsService) {
    this._initBreadcrumbs();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  private _initBreadcrumbs() {
    this._breadcrumbsService.setVisible(true);
    this._breadcrumbsService.setItems([
      {
        label: 'Продукты',
      },
      {
        label: 'Выбранный продукт',
      },
    ]);
  }
}
