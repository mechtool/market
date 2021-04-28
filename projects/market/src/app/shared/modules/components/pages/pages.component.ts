import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { PagesStaticService, SpinnerService } from '#shared/modules/common-services';
import { ActivatedRoute, Router } from '@angular/router';
import { pluck, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { unsubscribeList } from '#shared/utils';

@Component({
  template: '<div class="pages" [innerHTML]="content | marketSafeHtml"></div>',
  styleUrls: ['./pages.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PagesComponent implements OnDestroy {
  content: string;
  private activatedRouteSubscription: Subscription;

  constructor(
    private _router: Router,
    private _spinnerService: SpinnerService,
    private _activatedRoute: ActivatedRoute,
    private _pagesStaticService: PagesStaticService,
  ) {

    this.activatedRouteSubscription = this._activatedRoute.params
      .pipe(
        switchMap(() => {
          this._spinnerService.show();
          return this._pagesStaticService.getPageStatic();
        }),
        pluck('_embedded', 'items'),
      )
      .subscribe((pages) => {
        this._spinnerService.hide();
        if (pages.length) {
          this.content = pages[0].content;
        } else {
          this._router.navigateByUrl('/404');
        }
      }, () => {
        this._spinnerService.hide();
      });
  }

  ngOnDestroy(): void {
    unsubscribeList([this.activatedRouteSubscription]);
  }
}
