import {
  Injectable,
  ViewContainerRef,
  ComponentRef,
  OnDestroy,
} from '@angular/core';
import { ComponentPortal, Portal } from '@angular/cdk/portal';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { Subject, fromEvent } from 'rxjs';
import { map, takeUntil, debounceTime } from 'rxjs/operators';
import { NavItemModel } from './models';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { NavbarNavComponent } from '../../../routes/root/components/navbar/components/navbar-nav/navbar-nav.component';

@Injectable()
export class NavigationService implements OnDestroy {
  private _isMenuOpened = false;
  private _areCategoriesShowed = false;
  private _mainCategorySelectedId: string = null;
  private _componentPortal: ComponentPortal<NavbarNavComponent>;
  selectedPortal: Portal<any> | null;
  overlayRef: OverlayRef;
  componentRef: ComponentRef<any>;

  private _viewContainerRef: ViewContainerRef;

  set viewContainerRef(vcr: ViewContainerRef) {
    this._viewContainerRef = vcr;
  }

  get isMenuOpened() {
    return this._isMenuOpened;
  }

  get areCategoriesShowed() {
    return this._areCategoriesShowed;
  }

  get mainCategorySelectedId() {
    return this._mainCategorySelectedId;
  }

  private _unsubscriber$: Subject<any> = new Subject();

  get navItems$() {
    const notAuthedNavItems: NavItemModel[] = [
      {
        label: 'Поиск товаров',
        icon: 'search',
        routerLink: ['/search'],
      },
      {
        label: 'Категории товаров',
        icon: 'category',
        command: () => {
          this.toggleCategories();
        },
      },
      {
        label: 'Поставщики',
        icon: 'supplier',
        routerLink: ['/supplier'],
      },
      {
        label: 'Корзина',
        styleClass: 'delimiter',
        routerLink: ['/cart'],
        icon: 'basket',
        counter: 99,
      },
      {
        label: 'Личный кабинет',
        icon: 'personal',
        items: [
          {
            label: 'Войти',
            command: () => {
              this._authService.login(`${location.pathname}${location.search}`);
            },
          },
          {
            label: 'Зарегистрироваться',
            command: () => {
              this._authService.register();
            },
          },
        ],
      },
      {
        label: 'О проекте',
        icon: 'info',
        styleClass: 'delimiter',
        routerLink: ['/about'],
      },
    ];
    const authedNavItems: NavItemModel[] = [
      {
        label: 'Поиск товаров',
        icon: 'search',
        routerLink: ['/search'],
      },
      {
        label: 'Категории товаров',
        icon: 'category',
        command: () => {
          this.toggleCategories();
        },
      },
      {
        label: 'Поставщики',
        icon: 'supplier',
        routerLink: ['/supplier'],
      },
      {
        label: 'Корзина',
        icon: 'basket',
        styleClass: 'delimiter',
        routerLink: ['/cart'],
      },
      {
        label: 'Личный кабинет',
        icon: 'personal',
        styleClass: 'delimiter',
        items: [
          {
            label: 'Мои заказы',
            routerLink: ['/my/orders'],
          },
          {
            label: 'Мои организации',
            routerLink: ['/my/organizations'],
          },
          {
            label: 'Выход',
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
        icon: 'info',
        styleClass: 'delimiter',
        routerLink: ['/about'],
      },
    ];
    return this._userService.userData$.asObservable().pipe(
      takeUntil(this._unsubscriber$),
      map((res) => (res ? authedNavItems : notAuthedNavItems))
    );
  }

  constructor(
    private _userService: UserService,
    private _authService: AuthService,
    private _overlay: Overlay
  ) {
    this._componentPortal = new ComponentPortal(NavbarNavComponent);
    this.updateOnResolutionChanges();
    setTimeout(() => {
      if (window.innerWidth > 992) {
        this.selectedPortal = this._componentPortal;
      }
    }, 0);
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  updateOnResolutionChanges() {
    fromEvent(window, 'resize')
      .pipe(debounceTime(10))
      .subscribe(
        (evt: any) => {
          if (evt.target.innerWidth > 1300) {
            this.selectedPortal = this._componentPortal;
            if (this.overlayRef && this.overlayRef.hasAttached()) {
              this.overlayRef.dispose();
            }
          }
          if (evt.target.innerWidth > 992 && evt.target.innerWidth <= 1300) {
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
            this.selectedPortal = null;
            if (this._isMenuOpened) {
              this.overlayRef.dispose();
              this.openMenu();
            }
          }
        },
        (err) => {
          console.log('error');
        }
      );
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
      scrollStrategy: this._overlay.scrollStrategies.block(),
    });

    this.overlayRef = this._overlay.create(config);
    this.componentRef = this.overlayRef.attach(
      new ComponentPortal(NavbarNavComponent, this._viewContainerRef)
    );

    this._isMenuOpened = true;
    this.overlayRef.backdropClick().subscribe(() => {
      this._isMenuOpened = false;
      this.overlayRef.dispose();
      if (window.innerWidth > 992) {
        this.selectedPortal = this._componentPortal;
      }
    });
  }

  closeMenu() {
    this._isMenuOpened = false;
    this.overlayRef.dispose();
    if (window.innerWidth > 992) {
      this.selectedPortal = this._componentPortal;
    }
  }

  showCategories() {
    this._areCategoriesShowed = true;
  }

  hideCategories() {
    this._areCategoriesShowed = false;
  }

  toggleCategories() {
    this._areCategoriesShowed = !this._areCategoriesShowed;
  }

  setMainCategorySelectedId(id: string) {
    this._mainCategorySelectedId = id;
  }
}
