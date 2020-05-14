import {
  Component,
  Injector,
  HostBinding,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { NavigationService } from '#shared/modules/common-services/navigation.service';
import { UserService } from '#shared/modules/common-services/user.service';
import { NavItemModel } from '#shared/modules/common-services/models/nav-item.model';
import { CategoryModel } from '#shared/modules/common-services/models/category.model';

@Component({
  selector: 'my-navbar-nav',
  templateUrl: './navbar-nav.component.html',
  styleUrls: [
    './navbar-nav.component.scss',
    './navbar-nav.component-1300.scss',
    './navbar-nav.component-992.scss',
    './navbar-nav.component-768.scss',
    './navbar-nav.component-576.scss',
  ],
})
export class NavbarNavComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  private _navService: NavigationService;
  private _userService: UserService;
  navItems: NavItemModel[] = null;
  navItemActive: NavItemModel;

  get areCategoriesShowed(): boolean {
    return this._navService.areCategoriesShowed;
  }

  get mainCategorySelectedId(): string {
    return this._navService.mainCategorySelectedId;
  }

  get categoryItems$(): Observable<CategoryModel[]> {
    return this._userService.userCategories$.asObservable();
  }

  @HostBinding('class.expanded')
  get isExpandedMenu(): boolean {
    if (
      window.innerWidth > 992 &&
      window.innerWidth <= 1300 &&
      this._navService.isMenuOpened
    ) {
      return true;
    }
    if (window.innerWidth > 1300 || window.innerWidth <= 992) {
      return true;
    }
    return false;
  }

  constructor(
    private injector: Injector,
    private _location: Location,
    private _router: Router
  ) {
    this._navService = this.injector.get(NavigationService);
    this._userService = this.injector.get(UserService);
    this.categoryItems$.subscribe((res) => {
      this.setMainCategorySelectedId(res[0].id);
    });
  }

  ngOnInit() {
    this._navService.navItems$.pipe(takeUntil(this._unsubscriber$)).subscribe(
      (res) => {
        this.navItems = res;
        // TODO: оптимизировать проход по элементам меню
        this.navItems.forEach((el, i, arr) => {
          if (el.items?.length) {
            const subItem = el.items.find(
              (subItem) => subItem.routerLink?.[0] === this._location.path()
            );
            if (subItem) {
              this.navItemActive = subItem;
            }
            if (!subItem) {
              this.navItemActive = this.navItems.find((item) => {
                return item.routerLink?.[0] === this._location.path();
              });
            }
          }
        });
      },
      (err) => {
        console.log('error');
      }
    );
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  navigateNavItem(navItem: NavItemModel): void {
    if (navItem.label !== 'Категории товаров') {
      this.hideCategories();
      if (
        this._navService.overlayRef &&
        this._navService.overlayRef.hasAttached()
      ) {
        this._navService.overlayRef.dispose();
        this.closeMenu();
      }
    }

    if (navItem.items?.length) {
      navItem.expanded = !navItem.expanded;
    }
    if (!navItem.items) {
      this.navItemActive = navItem;
    }
    if (navItem.command) {
      navItem.command();
    }
    if (navItem.routerLink) {
      this._router.navigate(navItem.routerLink);
    }
    if (navItem.url) {
      location.assign(navItem.url);
    }
  }

  toggleMenu(): void {
    if (
      this._navService.screenWidthGreaterThan(992) &&
      this._navService.screenWidthLessThan(1300)
    ) {
      if (!this._navService.isMenuOpened) {
        this._navService.openMenu();
      } else {
        this.closeMenu();
      }
    }
  }

  closeMenuWithCategories() {
    this.hideCategories();
    this.closeMenu();
  }

  openMenu(): void {
    this._navService.openMenu();
  }

  closeMenu(): void {
    this._navService.closeMenu();
  }

  hideCategories(): void {
    this._navService.hideCategories();
  }

  handleCategories(): void {
    this._navService.hideCategories();
    this.setMainCategorySelectedId('1'); // TODO
  }

  setMainCategorySelectedId(id: string): void {
    this._navService.setMainCategorySelectedId(id);
  }
}
