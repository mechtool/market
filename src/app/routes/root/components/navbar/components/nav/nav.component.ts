import {
  Component,
  OnInit,
  OnDestroy,
  Input,
} from '@angular/core';
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
  @Input() isAuthed: boolean;
  navItems: NavItemModel[] = null;

  get isMenuExpanded$() {
    return this._navService.isMenuExpanded$.asObservable()
      .pipe(
        takeUntil(this._unsubscriber$),
        filter(res => !!res),
      );
  }

  constructor(private _navService: NavigationService) {}

  ngOnInit() {
    this.navItems = this._navService.getNavItems();
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

}
