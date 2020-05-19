import { Component, Input, HostBinding } from '@angular/core';
import { NavigationService } from '#shared/modules/common-services/navigation.service';

@Component({
  selector: 'my-mobile-nav',
  templateUrl: './mobile-nav.component.html',
  styleUrls: [
    './mobile-nav.component.scss',
    './mobile-nav.component-992.scss',
    './mobile-nav.component-576.scss',
  ],
})
export class NavbarMobileNavComponent {
  constructor(private _navService: NavigationService) {}

  openMenu() {
    this._navService.openMenu();
  }

  goToRoot() {
    this._navService.goTo();
  }
}
