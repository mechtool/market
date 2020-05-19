import { Component, OnDestroy, OnInit, HostBinding } from '@angular/core';
import { Subject } from 'rxjs';
import { NavigationService, ResponsiveService } from '#shared/modules';
import { filter, takeUntil } from 'rxjs/operators';
import { BreadcrumbsService } from './components/breadcrumbs/breadcrumbs.service';

@Component({
  templateUrl: './root.component.html',
  styleUrls: [
    './root.component.scss',
    './root.component-1300.scss',
    './root.component-992.scss',
  ],
})
export class RootComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();

  get isNavBarMinified(): boolean {
    return this._navService.isNavBarMinified;
  }

  get areCategoriesShowed(): boolean {
    return this._navService.areCategoriesShowed;
  }

  get breadcrumbsItems$() {
    return this._breadcrumbsService.getItems();
  }

  get isMenuOpened() {
    return this._navService.isMenuOpened;
  }

  constructor(
    private _navService: NavigationService,
    private _breadcrumbsService: BreadcrumbsService,
    private _responsiveService: ResponsiveService
  ) {
    this._responsiveService.init();
  }

  ngOnInit() {}

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }
}
