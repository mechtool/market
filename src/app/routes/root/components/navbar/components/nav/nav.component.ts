import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NavigationService } from '#shared/modules';
import { NavItemModel } from '#shared/modules/common-services/models';

@Component({
  selector: 'my-navbar-nav',
  templateUrl: './nav.component.html',
  styleUrls: [
    './nav.component.scss',
    './nav.component-768.scss',
  ],
})
export class NavbarNavComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  navItems: NavItemModel[] = null;
  navItemActive: NavItemModel;

  get isMenuExpanded$() {
    return this._navService.isMenuExpanded$.asObservable()
      .pipe(
        takeUntil(this._unsubscriber$),
        filter(res => !!res),
      );
  }

  constructor(
    private _navService: NavigationService,
    private _router: Router,
    private _location: Location,
  ) {}

  ngOnInit() {
    this._navService.navItems$
      .pipe(
        takeUntil(this._unsubscriber$),
      ).subscribe((res) => {
        this.navItems = res;
        // TODO: оптимизировать проход по элементам меню
        this.navItems.forEach((el, i, arr) => {
          if (el.items?.length) {
            const subItem = el.items.find(subItem => subItem.routerLink?.[0] === this._location.path());
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
      }, (err) => {
        console.log('error');
      });
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  navigateNavItem(navItem: NavItemModel): void {
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

}
