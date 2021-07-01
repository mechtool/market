import { Component, OnInit } from '@angular/core';
import { AllGroupQueryFiltersModel } from '#shared/modules/common-services/models';
import { Params, Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import {
  ExternalProvidersService,
  LocalStorageService,
  NotificationsService,
  SuggestionService
} from '#shared/modules/common-services';
import { queryParamsForProductsFrom } from '#shared/utils';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  firstCall = true;

  constructor(
    private _router: Router,
    private _suggestionService: SuggestionService,
    private _localStorageService: LocalStorageService,
    private _notificationsService: NotificationsService,
    private _externalProvidersService: ExternalProvidersService,
  ) {
  }

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
      queryParams: queryParamsForProductsFrom(filterGroup),
    });
  }

  updateResultsByFilters(filterGroup: AllGroupQueryFiltersModel): void {
    if (this.firstCall) {
      this.firstCall = false;
      return;
    }
    this.navigateToCategoryRoute(filterGroup);
  }
}
