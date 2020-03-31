import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NavItemModel } from './models';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { environment } from '#environments/environment';

const ITS_URL = environment.itsUrl;

@Injectable()
export class NavigationService implements OnDestroy {
  isMenuExpanded$: BehaviorSubject<boolean> = new BehaviorSubject(null);
  private _unsubscriber$: Subject<any> = new Subject();

  get navItems$() {
    const notAuthedNavItems: NavItemModel[] = [
      {
        label: 'Поиск товаров',
        icon: 'search',
        routerLink: ['/search']
      }, {
        label: 'Категории товаров',
        icon: 'category',
        routerLink: ['/category']
      }, {
        label: 'Поставщики',
        icon: 'supplier',
        routerLink: ['/supplier'],
        styleClass: 'delimiter',
      }, {
        label: 'Корзина',
        routerLink: ['/cart'],
        icon: 'basket',
      },  {
        label: 'Личный кабинет',
        icon: 'personal',
        styleClass: 'delimiter',
        items: [
          {
            label: 'Войти',
            command: () => {
              this._authService.login(`${location.pathname}${location.search}`);
            },
          }, {
            label: 'Зарегистрироваться',
            command: () => {
              this._authService.register();
            },
          },
        ]
      }, {
        label: 'О проекте',
        icon: 'info',
        routerLink: ['/about'],
      },
    ];
    const authedNavItems: NavItemModel[] = [
      {
        label: 'Поиск товаров',
        icon: 'search',
        routerLink: ['/search']
      }, {
        label: 'Категории товаров',
        icon: 'category',
        routerLink: ['/category']
      }, {
        label: 'Поставщики',
        icon: 'supplier',
        routerLink: ['/supplier'],
        styleClass: 'delimiter',
      }, {
        label: 'Корзина',
        icon: 'basket',
        routerLink: ['/cart'],
      }, {
        label: 'Личный кабинет',
        icon: 'personal',
        styleClass: 'delimiter',
        items: [
          {
            label: 'Мои заказы',
            routerLink: ['/my/orders'],
          }, {
            label: 'Мои организации',
            routerLink: ['/my/organizations'],
          }, {
            label: 'Выход',
            command: () => {
              this._authService.logout(`${location.pathname}${location.search}`);
            },
          },
        ]
      }, {
        label: 'О проекте',
        icon: 'info',
        routerLink: ['/about'],
      },
    ];
    return this._userService.userData$.asObservable()
      .pipe(
        takeUntil(this._unsubscriber$),
        map(res => res ? authedNavItems : notAuthedNavItems),
      );
  }

  constructor(
    private _userService: UserService,
    private _authService: AuthService,
  ) {}

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  toggleMenu(): void {
    this.isMenuExpanded$.next(this.isMenuExpanded$.value ? false : true);
  }


}
