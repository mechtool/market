import { Component, ViewContainerRef } from '@angular/core';
import { NavigationService } from '#shared/modules';
import { Portal } from '@angular/cdk/portal';

@Component({
  selector: 'market-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [
    './navbar.component.scss',
    './navbar.component-992.scss',
  ],
})
export class NavbarComponent {

  get selectedPortal(): Portal<any> | null {
    return this._navService.selectedPortal;
  }

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _navService: NavigationService
  ) {
    this._navService.viewContainerRef = this._viewContainerRef;
  }

}
