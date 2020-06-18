import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { NavigationService, ResponsiveService, BreadcrumbsService } from '#shared/modules';

@UntilDestroy({ checkProperties: true })
@Component({
  templateUrl: './root.component.html',
  styleUrls: [
    './root.component.scss',
    './root.component-1300.scss',
    './root.component-992.scss',
  ],
})
export class RootComponent {

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

}
