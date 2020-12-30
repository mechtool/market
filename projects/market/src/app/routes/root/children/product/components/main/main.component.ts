import { Component, OnInit } from '@angular/core';
import { AllGroupQueryFiltersModel } from '#shared/modules/common-services/models';
import { Params, Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ExternalProvidersService, LocalStorageService, NotificationsService, SuggestionService } from '#shared/modules/common-services';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss', './main.component-768.scss'],
})
export class MainComponent implements OnInit {
  constructor(
    private _router: Router,
    private _suggestionService: SuggestionService,
    private _localStorageService: LocalStorageService,
    private _notificationsService: NotificationsService,
    private _externalProvidersService: ExternalProvidersService,
  ) {}

  ngOnInit() {
    const tag = {
      event: 'HomePage',
    };
    this._externalProvidersService.fireGTMEvent(tag);
  }

  navigateToCategoryRoute(filterGroup: AllGroupQueryFiltersModel) {
    this._localStorageService.putSearchText(filterGroup.query);

    const categoryId = filterGroup.filters?.categoryId || null;
    this._router.navigate(['./category', ...(categoryId ? [categoryId] : [])], {
      queryParams: queryParamsFromNew(filterGroup),
    });
  }
}

// TODO: перенести в общий блок (category.component.ts)
export function queryParamsFromNew(groupQuery: AllGroupQueryFiltersModel): Params {
  return {
    q: groupQuery.query?.length === 0 ? undefined : groupQuery.query,
    supplierId: groupQuery.filters?.supplierId,
    trademark: groupQuery.filters?.trademark,
    isDelivery: groupQuery.filters?.isDelivery ? undefined : 'false',
    isPickup: groupQuery.filters?.isPickup ? undefined : 'false',
    inStock: !groupQuery.filters?.inStock ? undefined : 'true',
    withImages: !groupQuery.filters?.withImages ? undefined : 'true',
    hasDiscount: !groupQuery.filters?.hasDiscount ? undefined : 'true',
    priceFrom: groupQuery.filters?.priceFrom === 0 ? undefined : groupQuery.filters.priceFrom,
    priceTo: groupQuery.filters?.priceTo === 1000000 ? undefined : groupQuery.filters.priceTo,
  };
}
