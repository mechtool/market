import { Component } from '@angular/core';
import { NavigationService } from '#shared/modules/common-services/navigation.service';
import { CartService } from '#shared/modules/common-services/cart.service';

@Component({
  selector: 'market-mobile-nav',
  templateUrl: './mobile-nav.component.html',
  styleUrls: [
    './mobile-nav.component.scss',
    './mobile-nav.component-992.scss',
    './mobile-nav.component-576.scss',
  ],
})
export class NavbarMobileNavComponent {

  get getCartCounter$(): any {
    return this._cartService.cartCounter$;
  }

  constructor(
    private _navService: NavigationService,
    private _cartService: CartService,
  ) {
  }

  openMenu() {
    this._navService.openMenu();
  }
}
