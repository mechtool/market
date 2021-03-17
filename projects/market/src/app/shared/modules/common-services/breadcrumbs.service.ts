import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BreadcrumbItemModel } from './models';

@Injectable()
export class BreadcrumbsService {
  private _items$: BehaviorSubject<BreadcrumbItemModel[]> = new BehaviorSubject(null);
  private _visibleBreadcrumbs$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  get isVisible$(): Observable<boolean> {
    return this._visibleBreadcrumbs$.asObservable();
  }

  get items$(): Observable<BreadcrumbItemModel[]> {
    return this._items$.asObservable()
  }

  setItems(items: BreadcrumbItemModel[]): void {
    setTimeout(() => {
      this._items$.next(items);
    }, 0);
  }

  setVisible(val: boolean): void {
    this._visibleBreadcrumbs$.next(val);
  }
}

