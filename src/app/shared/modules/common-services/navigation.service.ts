import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NavItemModel } from './models';

@Injectable()
export class NavigationService {
  isMenuExpanded$: BehaviorSubject<boolean> = new BehaviorSubject(null);

  constructor(private _router: Router) {}

  toggleMenu(): void {
    this.isMenuExpanded$.next(this.isMenuExpanded$.value ? false : true);
  }

  getNavItems(): NavItemModel[] {
    return [
      {
        label: 'Поиск товаров',
        icon: 'search',
      }, {
        label: 'Категории товаров',
        icon: 'category',
      }, {
        label: 'Поставщики',
        icon: 'supplier',
        styleClass: 'delimiter',
      }, {
        label: 'Корзина',
        icon: 'basket',
      }, {
        label: 'События',
        icon: 'events',
      }, {
        label: 'Личный кабинет',
        icon: 'personal',
        styleClass: 'delimiter',
        items: [
          {
            label: 'Войти',
          }, {
            label: 'Зарегистрироваться',
          },
        ]
      }, {
        label: 'О проекте',
        icon: 'info',
      },
    ];
  }

}
