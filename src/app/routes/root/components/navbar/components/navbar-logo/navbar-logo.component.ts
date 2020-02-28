import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';
import { NavigationService, ResponsiveService } from '#shared/modules';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'c-navbar-logo',
  templateUrl: './navbar-logo.component.html',
  styleUrls: [
    './navbar-logo.component.scss',
    './navbar-logo.component-768.scss',
  ],
})
export class NavbarLogoComponent implements OnInit, OnDestroy {
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
    private _responsiveService: ResponsiveService,
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  screenWidthGreaterThan(val: number) {
    return this._responsiveService.screenWidthGreaterThan(val);
  }

  toggleMenu() {
    // TODO: don't need to use JavaScript style
    document.getElementsByTagName('body')[0].classList.toggle('left-menu');
    this._navService.toggleMenu();
  }


}
