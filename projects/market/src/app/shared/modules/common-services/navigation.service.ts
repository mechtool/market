import { ComponentRef, Injectable, OnDestroy, ViewContainerRef } from '@angular/core';
import { Location } from '@angular/common';
import { ComponentPortal, Portal } from '@angular/cdk/portal';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { BehaviorSubject, fromEvent, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { CategoryModel, MetrikaEventTypeModel, NavItemModel } from './models';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { ExternalProvidersService } from './external-providers.service';
import { NavbarNavComponent } from '../../../routes/root/components/navbar/components/navbar-nav/navbar-nav.component';
import { ActivatedRoute, NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { UserStateService } from './user-state.service';
import { CustomBlockScrollStrategy } from '../../../config/custom-block-scroll-strategy';

@UntilDestroy({ checkProperties: true })
@Injectable()
export class NavigationService implements OnDestroy {
  private _isNavBarMinified = false;
  isNavBarMinified$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _isMenuOpened = false;
  private _userCategories: CategoryModel[];
  private readonly _componentPortal: ComponentPortal<NavbarNavComponent>;
  selectedPortal: Portal<any> | null;
  overlayRef: OverlayRef;
  componentRef: ComponentRef<any>;
  history: string[] = [];
  historySubscription: Subscription;

  private _viewContainerRef: ViewContainerRef;

  set viewContainerRef(vcr: ViewContainerRef) {
    this._viewContainerRef = vcr;
  }

  get isNavBarMinified(): boolean {
    return this._isNavBarMinified;
  }

  get isMenuOpened(): boolean {
    return this._isMenuOpened;
  }

  get navItems$() {
    const notAuthedNavItems: NavItemModel[] = [
      {
        label: 'Товары',
        attributeId: 'product_menu_id',
        icon: 'search',
        command: () => {
          this.navigateReloadable(['/category']);
        },
      },
      {
        label: 'Поставщики',
        attributeId: 'supplier_menu_id',
        icon: 'supplier',
        routerLink: ['/supplier'],
      },
      {
        label: 'Акции',
        attributeId: 'promo_menu_id',
        icon: 'favorite',
        routerLink: ['/promo'],
      },
      {
        label: 'Корзина',
        attributeId: 'basket_menu_id',
        icon: 'basket',
        styleClass: 'delimiter',
        routerLink: ['/cart'],
        counter: 0,
      },
      {
        label: 'Зарегистрироваться',
        attributeId: 'register_menu_id',
        icon: 'personal',
        command: () => {
          this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.REGISTER);
          this._authService.register(`/my/organizations?tab=c;${this._location.path()}`);
        },
      },
      {
        label: 'Войти',
        attributeId: 'login_menu_id',
        icon: 'enter',
        command: () => {
          this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.SIGN_IN);
          this._authService.login(this._location.path());
        },
      },
      {
        label: 'О проекте',
        attributeId: 'info_menu_id',
        icon: 'info',
        styleClass: 'delimiter',
        items: [
          {
            label: 'О сервисе',
            attributeId: 'about_service_menu_id',
            url: 'https://1cbn.ru/trading.html',
            icon: 'point',
          },
          {
            label: 'Условия использования',
            attributeId: 'terms_of_use_menu_id',
            url: 'https://1cbn.ru/agreement',
            icon: 'point',
          },
        ],
      },
    ];
    const authedNavItems: NavItemModel[] = [
      {
        label: 'Товары',
        attributeId: 'product_menu_id',
        icon: 'search',
        command: () => {
          this.navigateReloadable(['/category']);
        },
      },
      {
        label: 'Поставщики',
        attributeId: 'supplier_menu_id',
        icon: 'supplier',
        routerLink: ['/supplier'],
      },
      {
        label: 'Акции',
        attributeId: 'promo_menu_id',
        icon: 'favorite',
        routerLink: ['/promo'],
      },
      {
        label: 'Корзина',
        attributeId: 'basket_menu_id',
        icon: 'basket',
        styleClass: 'delimiter',
        routerLink: ['/cart'],
        counter: 0,
      },
      {
        label: 'Мои заказы',
        attributeId: 'orders_menu_id',
        routerLink: ['/my/orders'],
        icon: 'order',
        counter: 0,
      },
      {
        label: 'Мои организации',
        attributeId: 'organization_menu_id',
        routerLink: ['/my/organizations'],
        icon: 'organization',
        counter: 0,
      },
      {
        label: 'Выход',
        attributeId: 'logout_menu_id',
        icon: 'logout',
        command: () => {
          this._authService.logout(this._location.path()).subscribe();
        },
      },
      {
        label: 'О проекте',
        attributeId: 'info_menu_id',
        icon: 'info',
        styleClass: 'delimiter',
        items: [
          {
            label: 'О сервисе',
            attributeId: 'about_service_menu_id',
            url: 'https://1cbn.ru/trading.html',
            icon: 'point',
          },
          {
            label: 'Условия использования',
            attributeId: 'terms_of_use_menu_id',
            url: 'https://1cbn.ru/agreement',
            icon: 'point',
          },
        ],
      },
    ];
    return this._userStateService.userData$.asObservable().pipe(map((auth) => (auth ? authedNavItems : notAuthedNavItems)));
  }

  constructor(
    private _userService: UserService,
    private _userStateService: UserStateService,
    private _authService: AuthService,
    private _externalProvidersService: ExternalProvidersService,
    private _overlay: Overlay,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _location: Location,
  ) {
    this.setHistory();
    this._componentPortal = new ComponentPortal(NavbarNavComponent);
    this._setUserCategories();
    this._updateLayoutOnResolutionChanges();
    this._renderInitialNavBar();
    this._setInitialNavBarType();
  }

  ngOnDestroy() {
    this.historySubscription?.unsubscribe();
  }

  setHistory() {
    this.historySubscription = this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
      }
    });
  }

  back(): void {
    this.history.pop();
    if (this.history.length > 1) {
      this._location.back();
    } else {
      this._router.navigateByUrl('/');
    }
  }

  screenWidthGreaterThan(val: number): boolean {
    return window.innerWidth > val || document.documentElement.clientWidth > val || document.body.clientWidth > val;
  }

  screenWidthLessThan(val: number): boolean {
    return window.innerWidth <= val || document.documentElement.clientWidth <= val || document.body.clientWidth <= val;
  }

  openMenu() {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      return;
    }
    this.selectedPortal = null;
    const config = new OverlayConfig({
      hasBackdrop: true,
      backdropClass: 'overlay-backdrop-dark',
      panelClass: 'nav-menu',
      scrollStrategy: new CustomBlockScrollStrategy(),
    });

    this.overlayRef = this._overlay.create(config);
    this.componentRef = this.overlayRef.attach(new ComponentPortal(NavbarNavComponent, this._viewContainerRef));

    this._isMenuOpened = true;
    this.overlayRef.backdropClick().subscribe(() => {
      this._isNavBarMinified = true;
      this.isNavBarMinified$.next(this._isNavBarMinified);
      this._isMenuOpened = false;
      this.overlayRef.dispose();
      if (window.innerWidth > 992) {
        this.selectedPortal = this._componentPortal;
      }
    });
  }

  closeMenu() {
    this._isMenuOpened = false;
    this.overlayRef?.dispose();
    if (window.innerWidth > 992) {
      this.selectedPortal = this._componentPortal;
    }
  }

  goTo(route: string[] = ['/']) {
    this._router.navigate(route);
  }

  navigateReloadable(commands: any[], extras?: NavigationExtras) {
    this._router.navigateByUrl('/blank', { skipLocationChange: true }).then(() => this._router.navigate(commands, extras));
  }

  private _setUserCategories(): void {
    this._userService.categories$.subscribe((res) => {
      this._userCategories = res;
    });
  }

  private _updateLayoutOnResolutionChanges(): void {
    fromEvent(window, 'resize')
      .pipe(debounceTime(10))
      .subscribe(
        (evt: any) => {
          if (evt.target.innerWidth > 1300) {
            this._isNavBarMinified = false;
            this.isNavBarMinified$.next(this._isNavBarMinified);
            this.selectedPortal = this._componentPortal;
            if (this.overlayRef && this.overlayRef.hasAttached()) {
              this.overlayRef.dispose();
            }
          }
          if (evt.target.innerWidth > 992 && evt.target.innerWidth <= 1300) {
            this._isNavBarMinified = true;
            this.isNavBarMinified$.next(this._isNavBarMinified);
            if (this._isMenuOpened) {
              this.overlayRef.dispose();
              this.openMenu();
              this.selectedPortal = null;
            }
            if (!this._isMenuOpened) {
              this.selectedPortal = this._componentPortal;
            }
          }
          if (evt.target.innerWidth <= 992) {
            this._isNavBarMinified = false;
            this.isNavBarMinified$.next(this._isNavBarMinified);
            this.selectedPortal = null;
            if (this._isMenuOpened) {
              this.overlayRef.dispose();
              this.openMenu();
            }
          }
          if (evt.target.innerWidth <= 768) {
          }
        },
        (err) => {
          console.log('error');
        },
      );
  }

  private _renderInitialNavBar(): void {
    setTimeout(() => {
      if (window.innerWidth > 992) {
        this.selectedPortal = this._componentPortal;
      }
    }, 0);
  }

  private _setInitialNavBarType(): void {
    this._isNavBarMinified = !!(this.screenWidthGreaterThan(992) && this.screenWidthLessThan(1300));
    this.isNavBarMinified$.next(this._isNavBarMinified);
  }
}
