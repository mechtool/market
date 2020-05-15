import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BreadcrumbItemModel } from '#shared/modules/common-services';
import { BreadcrumbsService } from './breadcrumbs.service';

@Component({
  selector: 'my-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: [
    './breadcrumbs.component.scss',
    './breadcrumbs.component-992.scss',
    './breadcrumbs.component-768.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {

  @Input() items: BreadcrumbItemModel[];

  get visibleBreadcrumbs$() {
    return this._breadcrumbsService.istVisible();
  }

  constructor(private _breadcrumbsService: BreadcrumbsService) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

}
