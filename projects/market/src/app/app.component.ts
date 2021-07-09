import { Component, OnDestroy } from '@angular/core';
import { ExternalProvidersService, UserService, UserStateService } from '#shared/modules/common-services';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { unsubscribeList } from '#shared/utils';
import {SwUpdateService} from '#shared/modules/common-services/sw-update.service';

@Component({
  selector: 'market-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  private readonly _routeChangeSubscription: Subscription;

  constructor(
    private _router: Router,
    private _userService: UserService,
    private _userStateService: UserStateService,
    private _externalProvidersService: ExternalProvidersService,
    private _swUpdate : SwUpdateService,
  ) {
    this._swUpdate.setUp();
    this._routeChangeSubscription = this._routeChanges$().subscribe(() => {
      this._externalProvidersService.resetYandexTranslatePopupPosition();
      this._externalProvidersService.hitYandexMetrika();
    });

    this._authedUserWindowCloseChanges$()
      .subscribe((uin) => {
        this._userService.setUserLastLoginTimestamp(uin, Date.now());
      });
  }

  ngOnDestroy() {
    unsubscribeList([this._routeChangeSubscription]);
  }

  private _routeChanges$(): Observable<NavigationEnd> {
    return this._router.events.pipe(filter((event) => event instanceof NavigationEnd)) as Observable<NavigationEnd>;
  }

  private _authedUserWindowCloseChanges$(): Observable<string> {
    return fromEvent(window, 'beforeunload').pipe(
      filter(() => {
        return !!this._userStateService.currentUser$.value?.userInfo.userId;
      }),
      tap((ev) => ev.preventDefault()),
      map(() => this._userStateService.currentUser$.value.userInfo.userId),
    );
  }
}
