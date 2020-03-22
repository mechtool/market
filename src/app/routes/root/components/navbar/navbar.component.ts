import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { takeUntil, filter, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NavigationService, AuthService } from '#shared/modules';

@Component({
  selector: 'my-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [
    './navbar.component.scss',
    './navbar.component-992.scss',
    './navbar.component-768.scss',
  ],
})
export class NavbarComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();

  get isMenuExpanded$() {
    return this._navService.isMenuExpanded$.asObservable()
      .pipe(
        takeUntil(this._unsubscriber$),
        filter(res => !!res),
      );
  }

  constructor(
    private _navService: NavigationService,
    private _authService: AuthService,
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }


}
