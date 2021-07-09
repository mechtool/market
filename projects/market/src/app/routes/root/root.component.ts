import { Component } from '@angular/core';
import { BreadcrumbsService, ResponsiveService } from '#shared/modules';

@Component({
  templateUrl: './root.component.html',
  styleUrls: [
    './root.component.scss',
    './root.component-992.scss',
    './root.component-768.scss'
  ],
})
export class RootComponent {
  get breadcrumbsItems$() {
    return this._breadcrumbsService.items$;
  }

  constructor(
    private _breadcrumbsService: BreadcrumbsService,
    private _responsiveService: ResponsiveService,
  ) {
    this._responsiveService.init();
  }
}
