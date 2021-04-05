import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { combineLatest, defer, forkJoin, Observable, of, race, Subscription } from 'rxjs';
import { map, pluck, switchMap, take, tap } from 'rxjs/operators';
import {
  EdiService,
  LocationService,
  NotificationsService,
  OrganizationsService,
  ResponsiveService,
  RfpItemResponseModel,
  RfpListResponseItemModel,
  SpinnerService,
  UserOrganizationModel,
  UserService,
  UserStateService,
} from '#shared/modules/common-services';
import { RfpViewComponent } from './components/rfp-view/rfp-view.component';
import { getKeyByValue, innKppToLegalId, unsubscribeList } from '#shared/utils';
import { RfpsService } from './rfps.service';
import { OfferViewComponent } from './components/offer-view/offer-view.component';
import { OfferListItemModel, RfpListItemModel } from './models';
import { IQuerySettings } from './interfaces';
import { TabTypeEnum } from './enums';

@Component({
  templateUrl: './rfps.component.html',
  styleUrls: [
    './rfps.component.scss',
    './rfps.component-1300.scss',
    './rfps.component-992.scss',
  ],
})
export class RfpsComponent implements OnInit, OnDestroy {
  selectedTabIndex: number = null;
  rfps: RfpListItemModel[] = null;
  offers: OfferListItemModel[] = null;
  userOrganizations: UserOrganizationModel[];
  mediaBreakPoint: string = null;

  private _queryParamsSubscription: Subscription;
  private _mediaBreakPointSubscription: Subscription;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _ediService: EdiService,
    private _userService: UserService,
    private _userStateService: UserStateService,
    private _notificationsService: NotificationsService,
    private _spinnerService: SpinnerService,
    private _modalService: NzModalService,
    private _rfpsService: RfpsService,
    private _organizationsService: OrganizationsService,
    private _locationService: LocationService,
    private _responsiveService: ResponsiveService,
  ) {}

  ngOnInit(): void {
    this._handleScreenWidthChanges();
    this._handleQueryParamsChanges();
  }

  ngOnDestroy(): void {
    unsubscribeList([
      this._queryParamsSubscription,
      this._mediaBreakPointSubscription,
    ]);
  }

  changeSelectedTabIndex(tabIndex: number): void {
    const type = `${getKeyByValue(TabTypeEnum, `${tabIndex}`)}`.toLowerCase();
    this._router.navigate(
      [],
      {
        relativeTo: this._activatedRoute,
        queryParams: { type },
        queryParamsHandling: 'merge'
      });
  }

  goToOpenModalViewRfp(rfpId: string | number): Promise<boolean> {
    return this._router.navigate(
      [],
      {
        relativeTo: this._activatedRoute,
        queryParams: { rfpId },
        queryParamsHandling: 'merge'
      });
  }

  goToOpenModalViewOffer(offerId: number): Promise<boolean> {
    return this._router.navigate(
      [],
      {
        relativeTo: this._activatedRoute,
        queryParams: { offerId },
        queryParamsHandling: 'merge'
      });
  }

  goToOpenModalViewRfpByOfferId(offerId: number): any {
    return this._rfpsService.getUserOfferById(offerId)
      .pipe(
        pluck('requestId')
      ).subscribe((rfpId) => {
        this.goToOpenModalViewRfp(rfpId);
      }, (err) => {
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      })
  }

  goToCreateRfpRoute(): Promise<boolean> {
    return this._router.navigate(['/my/rfps/create']);
  }

  goToEditRfpRoute(rfpId: string): Promise<boolean> {
    return this._router.navigate([`/my/rfps/edit/${rfpId}`]);
  }

  cancelRfp(rfpId: string): void {
    this._spinnerService.show();
    this._rfpsService.cancelUserRfpById(rfpId)
      .pipe(
        switchMap(() => {
          return this._setRfps$();
        })
      ).subscribe(() => {
      this._spinnerService.hide();
    }, () => {
      this._spinnerService.hide();
      this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
    });
  }

  private _handleScreenWidthChanges() {
    this._mediaBreakPointSubscription = this._responsiveService.mediaBreakpoint$.asObservable()
      .subscribe((mediaBreakPoint) => {
        this.mediaBreakPoint = mediaBreakPoint;
      })
  }

  private _handleQueryParamsChanges(): void {
    this._queryParamsSubscription = this._activatedRoute.queryParamMap
      .pipe(
        map(this._createQuerySettingsFromQueryParamMap),
      )
      .subscribe((querySettings) => {
        this.selectedTabIndex = this._getSelectedTabIndex(querySettings);
        if (this._isQueryParamTypeToReset(querySettings.tabType)) {
          this._resetQueryParams(['type']);
        }
        if (querySettings.rfpId) {
          this._openModalRfpView(querySettings.rfpId);
        } else if (querySettings.offerId) {
          this._openModalOfferView(+querySettings.offerId);
        }
      });
  }

  private _refreshRfps(): void {
    this._spinnerService.show();
    this._setRfps$()
      .subscribe(() => {
        this._spinnerService.hide();
      }, () => {
        this._spinnerService.hide();
        this._notificationsService.error('Ошибка при получении списка запросов.');
      });
  }

  private _refreshOffers(): void {
    this._spinnerService.show();
    this._setOffers$()
      .subscribe(() => {
        this._spinnerService.hide();
      }, () => {
        this._spinnerService.hide();
        this._notificationsService.error('Ошибка при получении списка предложений.');
      });
  }

  private _setRfps$(): Observable<any> {
    return combineLatest([
      this._getUserRfps(),
      this._getUserOrganizations(),
    ]).pipe(
      tap(([, orgs]) => {
        this.userOrganizations = orgs;
      }),
      tap(([rfps, orgs]) => {
        this.rfps = rfps?.reduce((accum, curr) => {
          const organization = orgs.find((org) => {
            return curr.proposalRequirements.customerPartyId === org.organizationId;
          });
          let rfp = null;
          if (organization) {
            rfp = new RfpListItemModel(curr)
              .setCustomerName(organization.organizationName)
              .setCustomerInn(organization.legalRequisites?.inn);
          }
          if (rfp) {
            accum.push(rfp);
          }
          return accum;
        }, []);
      })
    )
  }

  private _setOffers$(): Observable<any> {
    return this._getUserOrganizations()
      .pipe(
        tap((orgs) => {
          this.userOrganizations = orgs;
        }),
        switchMap((orgs) => {
          const legalIds = orgs.map((org) => innKppToLegalId(org.legalRequisites?.inn, org.legalRequisites?.kpp));
          return this._getUserOffers(legalIds);
        }),
        tap((offers) => {
          this.offers = offers;
        })
      )
  }

  private _getUserRfps(): Observable<RfpListResponseItemModel[]> {
    return this._rfpsService.getUserRfps();
  }

  private _getUserOffers(legalIds: string[]): Observable<OfferListItemModel[]> {
    const query = {
      legalIds,
      inbound: true,
      page: 0,
      size: 200,
    }
    return this._rfpsService.getUserOffers(query);
  }

  private _getUserOrganizations(): Observable<any> {
    return this._userService.organizations$.asObservable()
      .pipe(
        take(1),
      )
  }

  private _createQuerySettingsFromQueryParamMap(queryParamMap: ParamMap): IQuerySettings {
    return {
      tabType: queryParamMap.get('type'),
      rfpId: queryParamMap.get('rfpId'),
      offerId: queryParamMap.get('offerId'),
    }
  }

  private _getSelectedTabIndex(querySettings: IQuerySettings): number {
    const tabType = querySettings.tabType;
    let selectedTabIndex = +TabTypeEnum.RFPS;
    if (!!tabType && this._isTabTypeValid(tabType)) {
      const actualTabIndex = +TabTypeEnum[tabType.toUpperCase()];
      selectedTabIndex = actualTabIndex;
      if (selectedTabIndex === +TabTypeEnum.RFPS) {
        this._refreshRfps();
      }  if (selectedTabIndex === +TabTypeEnum.OFFERS) {
        this._refreshOffers();
      }
    } else {
      this._refreshRfps();
    }
    return selectedTabIndex;
  }

  private _isQueryParamTypeToReset(tabType: string): boolean {
    return !tabType || !this._isTabTypeValid(tabType);
  }

  private _isTabTypeValid(tabType: string): boolean {
    return Object.keys(TabTypeEnum).includes(tabType.toUpperCase());
  }

  private _openModalRfpView(rfpId: string): void {
    let modal = null;
    let rfpData = null;
    let audienceOrganizations = null;
    let deliveryRegionName = null;

    this._rfpsService.getUserRfpById(rfpId)
      .pipe(
        tap((res) => {
          if (res) {
            rfpData = res;
          }
        }),
        switchMap((res: RfpItemResponseModel) => {
          return defer(() => {
            if (res?.audience?.parties?.length) {
              const audiencePartiesLegalIds = res.audience.parties.map((party) => innKppToLegalId(party?.inn, party?.kpp));
              return forkJoin(audiencePartiesLegalIds.map((legalId) => this._organizationsService.getOrganizationByLegalId(legalId)))
            }
            return of(null);
          })
        }),
        tap((res) => {
          if (res?.length) {
            audienceOrganizations = res.filter((item) => !!item) || null;
          }
        }),
        switchMap(() => {
          if (rfpData?.proposalRequirements?.termsAndConditions?.deliveryRegion) {
            // tslint:disable-next-line:max-line-length
            return this._locationService.getLocations([rfpData.proposalRequirements.termsAndConditions.deliveryRegion.fiasRegionCode]);
          }
          return of(null);
        }),
        tap((res) => {
          if (res?.length) {
            deliveryRegionName = res[0]?.locality || res[0]?.name;
          }
        }),
        switchMap(() => {
          const modalConfig = {
            nzTitle: 'Просмотр ЗКП',
            nzContent: RfpViewComponent,
            nzFooter: null,
            nzWidth: 768,
            nzComponentParams: {
              configuration: {
                rfpData,
                audienceOrganizations,
                userOrganizations: this.userOrganizations,
                ...(deliveryRegionName && { deliveryRegionName }),
              }
            },
          };
          modal = this._modalService.create(modalConfig);
          return race(modal.afterClose, modal.componentInstance.destroyModalChange);
        })
      ).subscribe(() => {
        modal?.destroy();
        this._resetQueryParams(['rfpId']);
      }, (err) => {
        modal?.destroy();
        this._resetQueryParams(['rfpId']);
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      })

  }

  private _openModalOfferView(offerId: number): void {
    let modal = null;

    this._rfpsService.getUserOfferById(offerId)
      .pipe(
        switchMap((data) => {
          const modalConfig = {
            nzTitle: 'Просмотр предложения',
            nzContent: OfferViewComponent,
            nzFooter: null,
            nzWidth: 768,
            nzComponentParams: {
              configuration: {
                offerData: data,
              }
            },
          };
          modal = this._modalService.create(modalConfig);
          return race(modal.afterClose, modal.componentInstance.destroyModalChange);
        })
      ).subscribe(() => {
        modal?.destroy();
        this._resetQueryParams(['offerId']);
      }, (err) => {
        modal?.destroy();
        this._resetQueryParams(['offerId']);
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      })
  }

  private _resetQueryParams(paramNames: string[]): Promise<boolean> {
    const queryParams = paramNames.reduce((accum, curr) => {
      accum[curr] = null;
      return accum;
    }, {});
    return this._router.navigate(
      [],
      {
        queryParams,
        relativeTo: this._activatedRoute,
        queryParamsHandling: 'merge'
      });
  }

}
