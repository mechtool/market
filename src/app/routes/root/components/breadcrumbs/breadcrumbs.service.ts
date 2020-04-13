import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BreadcrumbItemModel } from '#shared/modules/common-services';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbsService {
  private items$: BehaviorSubject<BreadcrumbItemModel[]> = new BehaviorSubject(null);
  private visibleBreadcrumbs$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {
  }

  getItems() {
    return this.items$.asObservable();
  }

  setItems(items: BreadcrumbItemModel[]): void {
    setTimeout(() => {
      this.items$.next(items);
    }, 0);
  }

  istVisible() {
    return this.visibleBreadcrumbs$.asObservable();
  }

  setVisible(val: boolean): void {
    this.visibleBreadcrumbs$.next(val);
  }
}
