import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BreadcrumbItemModel, BreadcrumbsService } from '#shared/modules';

@UntilDestroy({ checkProperties: true })
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
export class BreadcrumbsComponent {

  @Input() items: BreadcrumbItemModel[];

  get visibleBreadcrumbs$() {
    return this._breadcrumbsService.istVisible();
  }

  constructor(private _breadcrumbsService: BreadcrumbsService) {}

}
