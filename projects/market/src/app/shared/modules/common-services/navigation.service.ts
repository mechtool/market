import { ComponentRef, Injectable, ViewContainerRef, } from '@angular/core';
import { ComponentPortal, Portal } from '@angular/cdk/portal';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { fromEvent } from 'rxjs';
import { debounceTime, filter, map, pairwise } from 'rxjs/operators';
import { CategoryModel, NavItemModel } from './models';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { NavbarNavComponent } from '../../../routes/root/components/navbar/components/navbar-nav/navbar-nav.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Injectable()
export class NavigationService {
  private _isNavBarMinified = false;
  private _isMenuOpened = false;
  private _mainCategorySelectedId: string = null;
  private _userCategories: CategoryModel[];
  private _componentPortal: ComponentPortal<NavbarNavComponent>;
  selectedPortal: Portal<any> | null;
  overlayRef: OverlayRef;
  componentRef: ComponentRef<any>;

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

  get areCategoriesShowed(): boolean {
    return !!this._activatedRoute.snapshot.queryParamMap.get('showCategories');
  }

  get mainCategorySelectedId(): string {
    return this._mainCategorySelectedId;
  }

  get navItems$() {
    const notAuthedNavItems: NavItemModel[] = [
      {
        label: 'Товары',
        attributeId: 'product_menu_id',
        icon: 'search',
        routerLink: ['/search'],
      },
      {
        label: 'Каталог',
        attributeId: 'catalog_menu_id',
        icon: 'category',
        command: () => {
          this.toggleCategoriesLayer();
        },
      },
      {
        label: 'Поставщики',
        attributeId: 'supplier_menu_id',
        icon: 'supplier',
        routerLink: ['/supplier'],
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
        label: 'Личный кабинет',
        attributeId: 'personal_menu_id',
        icon: 'personal',
        items: [
          {
            label: 'Войти',
            attributeId: 'login_menu_id',
            command: () => {
              this._authService.login(`${location.pathname}${location.search}`);
            },
          },
          {
            label: 'Зарегистрироваться',
            attributeId: 'register_menu_id',
            command: () => {
              this._authService.register();
            },
          },
        ],
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
          },
          {
            label: 'Условия использования',
            attributeId: 'terms_of_use_menu_id',
            url: 'https://1cbn.ru/agreement',
          },
        ],
      },
    ];
    const authedNavItems: NavItemModel[] = [
      {
        label: 'Товары',
        attributeId: 'product_menu_id',
        icon: 'search',
        routerLink: ['/search'],
      },
      {
        label: 'Каталог',
        attributeId: 'catalog_menu_id',
        icon: 'category',
        command: () => {
          this.toggleCategoriesLayer();
        },
      },
      {
        label: 'Поставщики',
        attributeId: 'supplier_menu_id',
        icon: 'supplier',
        routerLink: ['/supplier'],
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
        label: 'Личный кабинет',
        attributeId: 'personal_menu_id',
        icon: 'personal',
        items: [
          {
            label: 'Мои заказы',
            attributeId: 'orders_menu_id',
            routerLink: ['/my/orders'],
            counter: 0,
          },
          {
            label: 'Мои организации',
            attributeId: 'organization_menu_id',
            routerLink: ['/my/organizations'],
            counter: 0,
          },
          {
            label: 'Выход',
            attributeId: 'logout_menu_id',
            command: () => {
              this._authService.logout(
                `${location.pathname}${location.search}`
              );
            },
          },
        ],
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
          },
          {
            label: 'Условия использования',
            attributeId: 'terms_of_use_menu_id',
            url: 'https://1cbn.ru/agreement',
          },
        ],
      },
    ];
    return this._userService.userData$.asObservable().pipe(
      map((auth) => (auth ? authedNavItems : notAuthedNavItems))
    );
  }

  constructor(
    private _userService: UserService,
    private _authService: AuthService,
    private _overlay: Overlay,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {
    this._componentPortal = new ComponentPortal(NavbarNavComponent);
    this._setUserCategories();
    this.setInitialMainCategorySelectedId();
    this._updateLayoutOnResolutionChanges();
    this._renderInitialNavBar();
    this._setInitialNavBarType();
    this._closeCategoriesLayerOnNavigation();
  }

  screenWidthGreaterThan(val: number): boolean {
    return (
      window.innerWidth > val ||
      document.documentElement.clientWidth > val ||
      document.body.clientWidth > val
    );
  }

  screenWidthLessThan(val: number): boolean {
    return (
      window.innerWidth < val ||
      document.documentElement.clientWidth < val ||
      document.body.clientWidth < val
    );
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
      scrollStrategy: this._overlay.scrollStrategies.block(),
    });

    this.overlayRef = this._overlay.create(config);
    this.componentRef = this.overlayRef.attach(
      new ComponentPortal(NavbarNavComponent, this._viewContainerRef)
    );

    this._isMenuOpened = true;
    this.overlayRef.backdropClick().subscribe(() => {
      this._isNavBarMinified = true;
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

  openCategoriesLayer(route: string[] = []): void {
    this._router.navigate(route, {
      relativeTo: !route.length ? this._activatedRoute : null,
      queryParams: { showCategories: 'true' },
      queryParamsHandling: 'merge',
    });
  }

  closeCategoriesLayer(route: string[] = []): void {
    this._router.navigate(route, {
      relativeTo: !route.length ? this._activatedRoute : null,
      queryParams: { showCategories: null },
      queryParamsHandling: 'merge',
    });
  }

  toggleCategoriesLayer(): void {
    setTimeout(() => {
      if (!this.areCategoriesShowed) {
        this.openCategoriesLayer();
      }
      if (this.areCategoriesShowed) {
        this.closeCategoriesLayer();
      }
    }, 0);
  }

  setMainCategorySelectedId(id: string) {
    this._mainCategorySelectedId = id;
  }

  handleOpenerClick() {
    if (this.screenWidthLessThan(1300) && this.screenWidthGreaterThan(992)) {
      this._isNavBarMinified = true;
      if (!this.isMenuOpened) {
        this.openMenu();
      } else {
        this.closeMenu();
      }
    }

    if (this.screenWidthGreaterThan(1300)) {
      this._isNavBarMinified = !this._isNavBarMinified;
    }
  }

  goTo(route: string[] = ['/']) {
    this._router.navigate(route);
  }

  private _setUserCategories(): void {
    this._userService.categories$.subscribe((res) => {
      this._userCategories = res;
    });
  }

  setInitialMainCategorySelectedId(): void {
    this.setMainCategorySelectedId(
      this.screenWidthLessThan(768) ? null : this._userCategories[0].id
    );
  }

  private _updateLayoutOnResolutionChanges(): void {
    fromEvent(window, 'resize')
      .pipe(debounceTime(10))
      .subscribe(
        (evt: any) => {
          this.setMainCategorySelectedId(this._userCategories[0].id);
          if (evt.target.innerWidth > 1300) {
            this._isNavBarMinified = false;
            this.selectedPortal = this._componentPortal;
            if (this.overlayRef && this.overlayRef.hasAttached()) {
              this.overlayRef.dispose();
            }
          }
          if (evt.target.innerWidth > 992 && evt.target.innerWidth <= 1300) {
            this._isNavBarMinified = true;
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
            this.selectedPortal = null;
            if (this._isMenuOpened) {
              this.overlayRef.dispose();
              this.openMenu();
            }
          }
          if (evt.target.innerWidth <= 768) {
            this.setMainCategorySelectedId(null);
          }
        },
        (err) => {
          console.log('error');
        }
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
    this._isNavBarMinified = !!(
      this.screenWidthGreaterThan(992) && this.screenWidthLessThan(1300)
    );
  }

  private _closeCategoriesLayerOnNavigation(): void {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        pairwise()
      )
      .subscribe((event: any[]) => {
        if (event[0].url.includes('showCategories')) {
          this.closeCategoriesLayer();
        }
      });
  }
}
