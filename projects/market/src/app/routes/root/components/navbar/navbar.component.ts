import { Component, ViewContainerRef } from '@angular/core';
import { NavigationService } from '#shared/modules';

@Component({
  selector: 'market-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [
    './navbar.component.scss',
    './navbar.component-992.scss',
  ],
})
export class NavbarComponent {

  constructor(
    private _navService: NavigationService,
    private _viewContainerRef: ViewContainerRef,
  ) {
    this._navService.viewContainerRef = this._viewContainerRef;
  }

}
