import { Component, HostBinding, Injector, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { NavigationService } from '#shared/modules/common-services/navigation.service';
import { UserService } from '#shared/modules/common-services/user.service';
import { UserStateService } from '#shared/modules/common-services/user-state.service';
import { NavItemModel } from '#shared/modules/common-services/models/nav-item.model';
import { CartService } from '#shared/modules/common-services/cart.service';
import { NotificationsService } from '#shared/modules/common-services/notifications.service';
import { take } from 'rxjs/operators';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-navbar-nav',
  templateUrl: './navbar-nav.component.html',
  styleUrls: [
    './navbar-nav.component.scss',
    './navbar-nav.component-992.scss',
    './navbar-nav.component-768.scss',
    './navbar-nav.component-576.scss',
  ],
})
export class NavbarNavComponent implements OnInit {
  private _navService: NavigationService;
  private _userService: UserService;
  private _userStateService: UserStateService;
  private _cartService: CartService;
  navItems: NavItemModel[] = null;
  navItemActive: NavItemModel;

  get userLogin(): string {
    return this._userStateService.userData$?.value?.userInfo?.login || null;
  }

  get cartNavItem(): NavItemModel {
    return this.navItems?.find((item) => item.label === 'Корзина') || null;
  }

  get myOrganizationsItem(): NavItemModel {
    return this.navItems.reduce((accum, curr) => {
      if (accum) {
        return accum;
      }
      if (curr.items?.length) {
        accum = curr.items.find((it) => {
          return it.label === 'Мои организации';
        });
      }
      return accum;
    }, null);
  }

  get myOrdersItem(): NavItemModel {
    return this.navItems.reduce((accum, curr) => {
      if (accum) {
        return accum;
      }
      if (curr.items?.length) {
        accum = curr.items.find((it) => {
          return it.label === 'Мои заказы';
        });
      }
      return accum;
    }, null);
  }

  @HostBinding('class.minified')
  get isNavBarMinified(): boolean {
    return this._navService.isNavBarMinified && !this._navService.isMenuOpened;
  }

  constructor(
    private injector: Injector,
    private _location: Location,
    private _router: Router,
    private _notificationsService: NotificationsService,
  ) {
    this._navService = this.injector.get(NavigationService);
    this._userService = this.injector.get(UserService);
    this._userStateService = this.injector.get(UserStateService);
    this._cartService = this.injector.get(CartService);
  }

  ngOnInit() {
    this._setNavigation();
    this._watchSetCartDataCounter();
    this._watchSetParticipationRequestsCounter();
    this._watchSetNewAccountDocumentsCounter();
  }

  navigateNavItem(navItem: NavItemModel): void {
    if (navItem.items?.length) {
      navItem.expanded = !navItem.expanded;
    }
    if (!navItem.items) {
      this._setNavItemActive(navItem);
    }
    if (navItem.command) {
      if (this._navService.screenWidthLessThan(1300)) {
        this._navService.closeMenu();
      }
      navItem.command();
    }
    if (navItem.routerLink) {
      if (this._navService.screenWidthLessThan(1300)) {
        this._navService.closeMenu();
      }
      this._router.navigate(navItem.routerLink, {});
    }
    if (navItem.url) {
      window.open(navItem.url, '_blank');
    }
  }

  closeMenu(): void {
    this._navService.closeMenu();
  }

  goToRoot() {
    if (this._navService.screenWidthGreaterThan(992)) {
      this._navService.goTo();
    }
  }

  openMenuWidthLessThan1300() {
    if (!this._navService.isMenuOpened && this._navService.screenWidthLessThan(1300)) {
      this._navService.openMenu();
    }
  }

  closeMenuWidthLessThan1300() {
    if (this._navService.isMenuOpened && this._navService.screenWidthLessThan(1300)) {
      this._navService.closeMenu();
    }
  }

  private _setNavigation() {
    this._navService.navItems$.subscribe(
      (res) => {
        this.navItems = res;
        this._setNavItemActive(this._getActiveItem(this.navItems));
      },
      (err) => {
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      },
    );
  }

  private _getActiveItem(navItems: NavItemModel[]): NavItemModel {
    let activeItem = this._getItemForPath(navItems, this._location.path());
    navItems.forEach((el) => {
      if (el.items?.length) {
        const subItem = this._getItemForPath(el.items, this._location.path());
        if (subItem) {
          activeItem = subItem;
        }
      }
    });
    return activeItem;
  }

  private _getItemForPath(navItems: NavItemModel[], path: string): NavItemModel {
    return navItems.find((item) => item.routerLink?.[0] === path) || null;
  }

  private _setNavItemActive(navItem: NavItemModel): void {
    this.navItemActive = navItem;
  }

  private _watchSetCartDataCounter(): void {
    this._cartService.cartCounter$.subscribe((cartDataLength) => {
      this.cartNavItem.counter = cartDataLength;
    });
  }

  private _watchSetParticipationRequestsCounter(): void {
    this._userService.participationRequests$.subscribe((participationRequests) => {
      if (this.myOrganizationsItem) {
        this.myOrganizationsItem.counter = participationRequests?.length || 0;
      }
    });
  }

  private _watchSetNewAccountDocumentsCounter(): void {
    this._userService.newAccountDocumentsCounter$.subscribe((counter) => {
      if (this.myOrdersItem) {
        this.myOrdersItem.counter = counter || 0;
      }
    });
  }
}
