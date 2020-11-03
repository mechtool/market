import { Component } from '@angular/core';
import { AuthService, ExternalProvidersService, UserService, UserStateService } from '#shared/modules/common-services';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import { fromEvent, Observable } from 'rxjs';

@Component({
  selector: 'market-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private _userService: UserService,
    private _userStateService: UserStateService,
    private _router: Router,
    private _externalProvidersService: ExternalProvidersService,
    private _authService: AuthService,
  ) {
    this._routeChanges$().subscribe((res) => {
      this._externalProvidersService.resetYandexTranslatePopupPosition();
      this._externalProvidersService.hitYandexMetrika();
    });

    this._authedUserWindowCloseChanges$()
      .pipe(
        tap(() => {
          const revokeToken = this._authService.revoke().subscribe(() => revokeToken.unsubscribe());
        }),
      )
      .subscribe((uin) => {
        this._userService.setUserLastLoginTimestamp(uin, Date.now());
      });
  }

  private _routeChanges$(): Observable<NavigationEnd> {
    return this._router.events.pipe(filter((event) => event instanceof NavigationEnd)) as Observable<NavigationEnd>;
  }

  private _authedUserWindowCloseChanges$(): Observable<string> {
    return fromEvent(window, 'beforeunload').pipe(
      filter((ev) => {
        return !!this._userStateService.userData$.value?.userInfo.userId;
      }),
      tap((ev) => ev.preventDefault()),
      map((res) => this._userStateService.userData$.value.userInfo.userId),
    );
  }
}
