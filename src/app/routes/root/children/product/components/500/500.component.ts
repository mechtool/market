import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { BreadcrumbsService } from '../../../../components/breadcrumbs/breadcrumbs.service';

@Component({
  templateUrl: './500.component.html',
})
export class Code500Component implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();

  constructor(private _breadcrumbsService: BreadcrumbsService) {
    this._breadcrumbsService.setVisible(false);
  }

  ngOnInit() {}

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }
}
