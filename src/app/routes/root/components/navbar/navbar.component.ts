import { Component, OnDestroy, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { NavigationService } from '#shared/modules';
import { Portal } from '@angular/cdk/portal';

@Component({
  selector: 'my-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [
    './navbar.component.scss',
    './navbar.component-992.scss',
  ],
})
export class NavbarComponent implements OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();

  get selectedPortal(): Portal<any> | null {
    return this._navService.selectedPortal;
  }

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _navService: NavigationService
  ) {
    this._navService.viewContainerRef = this._viewContainerRef;
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  openMenu() {
    this._navService.openMenu();
  }
}
