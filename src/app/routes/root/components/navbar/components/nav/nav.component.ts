import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
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
  ) {}

  ngOnInit() {
    this._navService.navItems$
      .pipe(
        takeUntil(this._unsubscriber$),
      ).subscribe((res) => {
        this.navItems = res;
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
