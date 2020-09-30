import { Component } from '@angular/core';
import { ExternalProvidersService, UserService } from '#shared/modules';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import { fromEvent, Observable } from 'rxjs';

@Component({
  selector: 'market-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private _userService: UserService, private _router: Router, private _externalProvidersService: ExternalProvidersService) {
    this._routeChanges$().subscribe((res) => {
      this._externalProvidersService.resetYandexTranslatePopupPosition();
      this._externalProvidersService.hitYandexMetrika();
    });

    this._authedUserWindowCloseChanges$().subscribe((uin) => {
      this._userService.setUserLastLoginTimestamp(uin, Date.now());
    });
  }

  private _routeChanges$(): Observable<NavigationEnd> {
    return this._router.events.pipe(filter((event) => event instanceof NavigationEnd)) as Observable<NavigationEnd>;
  }

  private _authedUserWindowCloseChanges$(): Observable<string> {
    return fromEvent(window, 'beforeunload').pipe(
      filter((ev) => {
        return !!this._userService.userData$.value?.userInfo.userId;
      }),
      tap((ev) => ev.preventDefault()),
      map((res) => this._userService.userData$.value.userInfo.userId),
    );
  }
}
