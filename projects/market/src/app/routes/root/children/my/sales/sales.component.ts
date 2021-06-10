import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DocumentDto, PriceListResponseModel, PriceListStatusEnum } from '#shared/modules/common-services/models';
import {
  EdiService,
  NotificationsService,
  PriceListsService,
  SpinnerService,
  UserStateService
} from '#shared/modules/common-services';
import { delay, repeatWhen, take } from 'rxjs/operators';
import { unsubscribeList } from '#shared/utils';
import { ActivatedRoute, Router } from '@angular/router';

const PAGE_SIZE = 100;

@Component({
  templateUrl: './sales.component.html',
  styleUrls: [
    './sales.component.scss',
    './sales.component-1300.scss',
    './sales.component-992.scss',
    './sales.component-768.scss',
  ],
})
export class SalesComponent implements OnDestroy {
  selectedTab: number;
  priceLists: PriceListResponseModel[];
  orderDocuments: DocumentDto[];
  pageOrderDocuments = 1;
  private isNotEmptyOrderDocumentsResponse = true;
  private feedsSubscription: Subscription;
  private activatedRouteSubscription: Subscription;

  get newCustomerOrderDocumentsCounter$(): Observable<number> {
    return this._ediService.newInboundOrderDocumentsCounter$;
  }

  constructor(
    private _router: Router,
    private _ediService: EdiService,
    private _activatedRoute: ActivatedRoute,
    private _spinnerService: SpinnerService,
    private _userStateService: UserStateService,
    private _priceListsService: PriceListsService,
    private _notificationsService: NotificationsService,
  ) {
    this.activatedRouteSubscription = this._activatedRoute.queryParams
      .subscribe((queryParam) => {
        this.selectedTab = +queryParam.tab || 0;
      });

    this.initPriceLists();
    this.initInboundOrders();
  }

  ngOnDestroy(): void {
    unsubscribeList([this.feedsSubscription, this.activatedRouteSubscription]);
    const uin = this._userStateService.currentUser$.value?.userInfo.userId;
    if (uin) {
      this._ediService.setUserLastVisitTabInboundOrdersTimestamp(uin, Date.now());
      this._ediService.updateNewInboundOrdersDocumentsCounter().subscribe();
    }
  }

  initPriceLists() {
    this._spinnerService.show();
    this._priceListsService.getPriceLists()
      .subscribe((priceLists) => {
        this._spinnerService.hide();
        this.priceLists = priceLists;
        this.priceLists?.sort((one, two) => one.name < two.name ? -1 : (one.name > two.name ? 1 : 0))
        if (priceLists?.some((pl) => pl.feedInfo.status === PriceListStatusEnum.IN_PROGRESS)) {
          this.listenPriceListFeeds();
        }
      }, () => {
        this._spinnerService.hide();
        this._notificationsService.error();
      });
  }

  initInboundOrders() {
    this._spinnerService.show();
    this.pageOrderDocuments = 1;
    this._ediService.inboundOrders(this.pageOrderDocuments, PAGE_SIZE)
      .subscribe((documents) => {
          this._spinnerService.hide();
          if (documents?.length) {
            this.orderDocuments = documents.map((doc) => DocumentDto.forInboundOrder(doc));
          } else {
            this.isNotEmptyOrderDocumentsResponse = false;
          }
        },
        (err) => {
          this._spinnerService.hide();
          this._notificationsService.error();
        },
      );
  }

  loadOrderDocuments(nextPage: number) {
    if (nextPage === this.pageOrderDocuments + 1 && this.isNotEmptyOrderDocumentsResponse) {
      this._spinnerService.show();
      this.pageOrderDocuments = nextPage;
      this._ediService.inboundOrders(nextPage, PAGE_SIZE)
        .subscribe((documents) => {
            this._spinnerService.hide();
            if (documents?.length) {
              this.orderDocuments.push(...documents.map((doc) => DocumentDto.forInboundOrder(doc)));
            } else {
              this.isNotEmptyOrderDocumentsResponse = false;
            }
          },
          (err) => {
            this._spinnerService.hide();
            this._notificationsService.error();
          },
        );
    }
  }

  listenPriceListFeeds() {
    this.feedsSubscription?.unsubscribe();
    this.feedsSubscription = this._priceListsService.getPriceLists()
      .pipe(
        repeatWhen((repeat) => {
          return repeat
            .pipe(
              take(50),
              delay(5000)
            );
        })
      ).subscribe((priceLists) => {
        this.priceLists = priceLists;
        this.priceLists?.sort((one, two) => one.name < two.name ? -1 : (one.name > two.name ? 1 : 0))
        if (priceLists?.every((pl) => pl.feedInfo.status !== PriceListStatusEnum.IN_PROGRESS)) {
          this.feedsSubscription?.unsubscribe();
        }
      }, () => {
        this.feedsSubscription?.unsubscribe();
      });
  }

  changeTab(index: number) {
    this._router.navigate([], {
      queryParams: { tab : index },
      queryParamsHandling: 'merge'
    })
  }
}
