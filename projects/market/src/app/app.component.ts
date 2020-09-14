import { Component, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from '#shared/modules';
import { Metrika } from 'ng-yandex-metrika';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'market-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private _userService: UserService, private _metrika: Metrika, private _router: Router, private _location: Location) {
    let prevPath = this._location.path();
    this._router.events
      .pipe(
        filter((event) => {
          return window.location.hostname === 'market.1cbn.ru' && window.location.port !== '4200';
        }),
        filter((event) => {
          return event instanceof NavigationEnd;
        }),
      )
      .subscribe(() => {
        const newPath = this._location.path();
        this._metrika.hit(newPath, {
          referer: prevPath,
        });
        prevPath = newPath;
      });
  }

  @HostListener('window:beforeunload', ['$event']) onCloseApp(event: Event) {
    const uin = this._userService.userData$.value?.userInfo.userId || null;
    if (uin) {
      event.preventDefault();
      this._userService.setUserLastLoginTimestamp(uin, Date.now());
    }
  }
}
