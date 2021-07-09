import { Component, OnDestroy, ViewContainerRef } from '@angular/core';
import {
  AuthService,
  CartService,
  CountryCode,
  EdiService,
  LocalStorageService,
  UserService,
  UserStateService
} from '#shared/modules/common-services';
import { UserInfoModel } from '#shared/modules/common-services/models/user-info.model';
import { Location } from '@angular/common';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FeedbackComponent } from '#shared/modules/lazy/feedback/feedback.component';
import { AddressSearchFormComponent } from '#shared/modules/components/address-search-form';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { unsubscribeList } from '#shared/utils';

@Component({
  selector: 'market-new-navbar',
  templateUrl: './new-navbar.component.html',
  styleUrls: [
    './new-navbar.component.scss',
    './new-navbar.component-992.scss',
    './new-navbar.component-768.scss',
  ],
})
export class NewNavbarComponent implements OnDestroy {

  city: string;
  menuIsDisplayed = false;

  productsInCart: number;
  newAccountDocuments: number;
  participationRequests: number;
  newInboundOrderDocuments: number;

  private readonly _userLocationSubscription: Subscription;
  private readonly _cartCounterSubscription: Subscription;
  private readonly _participationRequestsCounterSubscription: Subscription;
  private readonly _newAccountDocumentsCounterSubscription: Subscription;
  private readonly _newInboundOrderDocumentsCounterSubscription: Subscription;

  get isAuthenticated(): boolean {
    return !!this.userInfo;
  }

  get isAnonymous(): boolean {
    return !this.userInfo;
  }

  get userInfo(): UserInfoModel {
    return this._userStateService.currentUser$.getValue()?.userInfo;
  }

  constructor(
    private _router: Router,
    private _location: Location,
    private _ediService: EdiService,
    private _userService: UserService,
    private _cartService: CartService,
    private _authService: AuthService,
    private _modalService: NzModalService,
    private _viewContainerRef: ViewContainerRef,
    private _userStateService: UserStateService,
    private _localStorageService: LocalStorageService
  ) {
    this._userLocationSubscription = this._localStorageService.userLocation$
      .subscribe((ul) => {
        this.city = !ul || ul.fias === CountryCode.RUSSIA ? null : ul.name;
      });

    this._cartCounterSubscription = this._cartService.cartCounter$
      .subscribe((counter) => {
        this.productsInCart = counter;
      });

    this._participationRequestsCounterSubscription = this._userService.participationRequests$
      .subscribe((participationRequests) => {
        this.participationRequests = participationRequests?.length || 0;
      });

    this._newAccountDocumentsCounterSubscription = this._ediService.newAccountDocumentsCounter$
      .subscribe((counter) => {
        this.newAccountDocuments = counter || 0;
      });

    this._newInboundOrderDocumentsCounterSubscription = this._ediService.newInboundOrderDocumentsCounter$
      .subscribe((counter) => {
        this.newInboundOrderDocuments = counter || 0;
      });
  }

  ngOnDestroy(): void {
    unsubscribeList([
      this._cartCounterSubscription,
      this._userLocationSubscription,
      this._newAccountDocumentsCounterSubscription,
      this._participationRequestsCounterSubscription,
      this._newInboundOrderDocumentsCounterSubscription,
    ]);
  }

  login() {
    this._authService.login();
  }

  register() {
    this._authService.register();
  }

  logout() {
    this._authService.logout(this._location.path()).subscribe();
  }

  showMenu($event: boolean) {
    this.menuIsDisplayed = $event;
  }

  async loadFeedbackComponent() {
    const modal = this._modalService.create({
      nzContent: FeedbackComponent,
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

  changeCity() {
    const modal = this._modalService.create({
      nzTitle: 'Укажите Ваш населенный пункт',
      nzContent: AddressSearchFormComponent,
      nzFooter: null,
      nzWidth: 400,
      nzComponentParams: {}
    });

    modal.componentInstance.cityFiasCodeChange.subscribe(() => {
      modal.close();
      this._refreshPage();
    });
  }

  private _refreshPage() {
    const currentUrl = this._router.url;
    this._router.navigateByUrl('/blank', { skipLocationChange: true }).then(() => {
      this._router.navigateByUrl(currentUrl);
    });
  }
}
