import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BreadcrumbItemModel, BreadcrumbsService } from '#shared/modules';
import { NavigationService } from '#shared/modules/common-services/navigation.service';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss', './breadcrumbs.component-992.scss', './breadcrumbs.component-768.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent {
  @Input() items: BreadcrumbItemModel[];

  get visibleBreadcrumbs$() {
    return this._breadcrumbsService.istVisible();
  }

  constructor(private _breadcrumbsService: BreadcrumbsService, private _navigationService: NavigationService) {}

  goTo(item: BreadcrumbItemModel, event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this._navigationService.navigateReloadable([item.routerLink], { ...(item.queryParams && { queryParams: item.queryParams }) });
  }
}
