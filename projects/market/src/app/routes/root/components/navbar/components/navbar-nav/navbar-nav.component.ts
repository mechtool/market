import { Component, HostBinding, Injector, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService } from '#shared/modules/common-services/navigation.service';
import { UserService } from '#shared/modules/common-services/user.service';
import { UserStateService } from '#shared/modules/common-services/user-state.service';
import { NavItemModel } from '#shared/modules/common-services/models/nav-item.model';
import { CartService } from '#shared/modules/common-services/cart.service';
import { unsubscribeList } from '#shared/utils';
import { EdiService } from '#shared/modules/common-services/edi.service';

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
export class NavbarNavComponent implements OnInit, OnDestroy {
  private _ediService: EdiService;
  private _userService: UserService;
  private _cartService: CartService;
  private _navService: NavigationService;
  private _userStateService: UserStateService;

  navItems: NavItemModel[] = null;
  navItemActive: NavItemModel;
  currentYear: number = new Date().getFullYear();

  get userLogin(): string {
    return this._userStateService.currentUser$?.value?.userInfo?.login || null;
  }

  get cartNavItem(): NavItemModel {
    return this.navItems?.find((item) => item.label === 'Корзина') || null;
  }

  get myOrganizationsItem(): NavItemModel {
    return this.navItems?.find((item) => item.label === 'Мои организации') || null;
  }

  get myOrdersItem(): NavItemModel {
    return this.navItems?.find((item) => item.label === 'Мои заказы') || null;
  }

  get mySalesItem(): NavItemModel {
    return this.navItems?.find((item) => item.label === 'Мои продажи') || null;
  }

  @HostBinding('class.minified')
  get isNavBarMinified(): boolean {
    return this._navService.isNavBarMinified && !this._navService.isMenuOpened;
  }

  private _navItemsSubscription: Subscription;
  private _cartCounterSubscription: Subscription;
  private _participationRequestsSubscription: Subscription;
  private _newAccountDocumentsCounterSubscription: Subscription;
  private _newInboundOrderDocumentsCounterSubscription: Subscription;

  constructor(
    private _router: Router,
    private _injector: Injector,
    private _location: Location,
  ) {
    this._ediService = this._injector.get(EdiService);
    this._cartService = this._injector.get(CartService);
    this._userService = this._injector.get(UserService);
    this._navService = this._injector.get(NavigationService);
    this._userStateService = this._injector.get(UserStateService);
  }

  ngOnInit() {
    this._setNavigation();
    this._watchSetCartDataCounter();
    this._watchSetParticipationRequestsCounter();
    this._watchSetNewAccountDocumentsCounter();
    this._watchSetNewInboundOrderDocumentsCounter();
  }

  ngOnDestroy() {
    unsubscribeList([
      this._navItemsSubscription,
      this._cartCounterSubscription,
      this._participationRequestsSubscription,
      this._newAccountDocumentsCounterSubscription,
      this._newInboundOrderDocumentsCounterSubscription
    ]);
  }

  navigateNavItem(navItem: NavItemModel): void {
    if (navItem.items?.length) {
      navItem.expanded = !navItem.expanded;
    }
    if (!navItem.items) {
      this._setNavItemActive(navItem);
    }
    if (navItem.command) {
      if (this._navService.screenWidthLessThan(768)) {
        this._navService.closeMenu();
      }
      navItem.command();
    }
    if (navItem.routerLink) {
      if (this._navService.screenWidthLessThan(768)) {
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

  private _setNavigation() {
    this._navItemsSubscription = this._navService.navItems$.subscribe(
      (res) => {
        this.navItems = res;
        this._setNavItemActive(this._getActiveItem(this.navItems));
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
    this._cartCounterSubscription = this._cartService.cartCounter$.subscribe((cartDataLength) => {
      this.cartNavItem.counter = cartDataLength;
    });
  }

  private _watchSetParticipationRequestsCounter(): void {
    this._participationRequestsSubscription = this._userService.participationRequests$.subscribe((participationRequests) => {
      if (this.myOrganizationsItem) {
        this.myOrganizationsItem.counter = participationRequests?.length || 0;
      }
    });
  }

  private _watchSetNewAccountDocumentsCounter(): void {
    this._newAccountDocumentsCounterSubscription = this._ediService.newAccountDocumentsCounter$.subscribe((counter) => {
      if (this.myOrdersItem) {
        this.myOrdersItem.counter = counter || 0;
      }
    });
  }

  private _watchSetNewInboundOrderDocumentsCounter(): void {
    this._newInboundOrderDocumentsCounterSubscription = this._ediService.newInboundOrderDocumentsCounter$.subscribe((counter) => {
      if (this.mySalesItem) {
        this.mySalesItem.counter = counter || 0;
      }
    });
  }
}
