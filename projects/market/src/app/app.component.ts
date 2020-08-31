import { Component, HostListener } from '@angular/core';
import { UserService } from '#shared/modules';

@Component({
  selector: 'market-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private _userService: UserService) {}

  @HostListener('window:beforeunload', ['$event']) onCloseApp(event: Event) {
    const uin = this._userService.userData$.value?.userInfo.userId || null;
    if (uin) {
      event.preventDefault();
      this._userService.setUserLastLoginTimestamp(uin, Date.now());
    }
  }
}
