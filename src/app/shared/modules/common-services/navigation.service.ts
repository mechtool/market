import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NavItemModel } from './models';
import { AuthService } from './auth.service';
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
              this._authService.login(`/my/lists`);
            },
          }, {
            label: 'Зарегистрироваться',
            command: () => {
              this._authService.register(`/my/lists`);
            },
          },
        ]
      }, {
        label: 'О проекте',
        icon: 'info',
        routerLink: ['/'],
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
        routerLink: ['/cart'],
        icon: 'basket',
      }, {
        label: 'Личный кабинет',
        icon: 'personal',
        styleClass: 'delimiter',
        items: [
          {
            label: 'Мои заказы',
            routerLink: ['/my/orders'],
          }, {
            label: 'Списки закупок',
            routerLink: ['/my/lists'],
          }, {
            label: 'Поставщики',
            routerLink: ['/'],
          }, {
            label: 'Мои организации',
            routerLink: ['/my/organizations'],
          },
        ]
      }, {
        label: 'О проекте',
        icon: 'info',
        routerLink: ['/'],
      }, {
        label: 'Настройки_нет_иконки',
        icon: 'info',
        routerLink: ['/'],
      }, {
        label: 'Выход_верстка_без_иконки',
        icon: 'info',
        command: () => {
          this._authService.logout();
        },
      },
    ];
    return this._authService.userData$.asObservable()
      .pipe(
        takeUntil(this._unsubscriber$),
        map(res => res ? authedNavItems : notAuthedNavItems),
      );
  }

  constructor(
    private _router: Router,
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
