import {
  Compiler,
  Component,
  ComponentFactoryResolver,
  Injector,
  OnDestroy,
  ViewContainerRef
} from '@angular/core';
import { AuthService, ExternalProvidersService, UserService, UserStateService } from '#shared/modules/common-services';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { unsubscribeList } from '#shared/utils';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'market-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  private readonly _routeChangeSubscription: Subscription;

  constructor(
    private _router: Router,
    private _injector: Injector,
    private _compiler: Compiler,
    private _authService: AuthService,
    private _userService: UserService,
    private _modalService: NzModalService,
    private _cfr: ComponentFactoryResolver,
    private _userStateService: UserStateService,
    private _viewContainerRef: ViewContainerRef,
    private _externalProvidersService: ExternalProvidersService,
  ) {
    this._routeChangeSubscription = this._routeChanges$().subscribe(() => {
      this._externalProvidersService.resetYandexTranslatePopupPosition();
      this._externalProvidersService.hitYandexMetrika();
    });

    this._authedUserWindowCloseChanges$()
      .subscribe((uin) => {
        this._userService.setUserLastLoginTimestamp(uin, Date.now());
      });
  }

  ngOnDestroy() {
    unsubscribeList([this._routeChangeSubscription]);
  }

  async loadFeedbackComponent() {

    const feedbackComponent = (await import(`./shared/modules/lazy/feedback/feedback.component`)).FeedbackComponent;
    const modal = this._modalService.create({
      nzContent: feedbackComponent,
      nzViewContainerRef: this._viewContainerRef,
      nzFooter: null,
      nzWidth: 450,
    });

    const subscription = modal.componentInstance.feedbackEvent.subscribe((success) => {
      if (success) {
        modal.destroy(true);
        subscription.unsubscribe();
      }
    });
  }

  private _routeChanges$(): Observable<NavigationEnd> {
    return this._router.events.pipe(filter((event) => event instanceof NavigationEnd)) as Observable<NavigationEnd>;
  }

  private _authedUserWindowCloseChanges$(): Observable<string> {
    return fromEvent(window, 'beforeunload').pipe(
      filter(() => {
        return !!this._userStateService.currentUser$.value?.userInfo.userId;
      }),
      tap((ev) => ev.preventDefault()),
      map(() => this._userStateService.currentUser$.value.userInfo.userId),
    );
  }
}
