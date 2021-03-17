import { Component, Input, OnInit } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { ProductService } from '#shared/modules/common-services/product.service';
import { ProductOffersModel } from '#shared/modules/common-services/models';
import { NavigationService } from '#shared/modules/common-services/navigation.service';
import { NotificationsService } from '#shared/modules/common-services/notifications.service';
import { debounceTime, filter, take } from 'rxjs/operators';

const MOBILE_SCREEN_WIDTH_BREAKPOINT = 992;
const MOBILE_NUMBER_RESTRICTION = 6;

// TODO ВЫНЕСТИ В SHARED ПАПКУ!!!!!!!!!!!!!!!!!!!!!!!
@Component({
  selector: 'market-main-popular',
  templateUrl: './popular.component.html',
  styleUrls: [
    './popular.component.scss',
    './popular.component-992.scss',
    './popular.component-768.scss',
    './popular.component-576.scss',
  ],
})
export class MainPopularComponent implements OnInit {
  productOffers: ProductOffersModel[];
  @Input() categoryId: string;
  @Input() size: number;

  private _isMobile = false;
  private _productOffersCached: ProductOffersModel[];
  private _scrollSubscription: Subscription;

  constructor(
    private _productService: ProductService,
    private _notificationsService: NotificationsService,
    private _navigationService: NavigationService,
  ) {}

  ngOnInit() {
    this._getPopularNomenclatures();
    this._handleScrollChanges();
  }

  private _getPopularNomenclatures(): void {
    this._productService.getPopularProductOffers(this.categoryId, this.size)
      .subscribe((products) => {
        this._isMobile = this._navigationService.screenWidthLessThan(MOBILE_SCREEN_WIDTH_BREAKPOINT);
        this._productOffersCached = products._embedded.productOffers;
        this.productOffers = this._productOffersCached
          .slice(0, this._isMobile ? MOBILE_NUMBER_RESTRICTION : this._productOffersCached.length);
      }, (err) => {
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      });
  }

  private _handleScrollChanges() {
    this._scrollSubscription = fromEvent(window, 'scroll')
      .pipe(
        filter((evt) => {
          return this._isMobile && evt.constructor.name !== 'CustomEvent';
        }),
        debounceTime(300),
        take(1),
      )
      .subscribe((evt: any) => {
        this.productOffers = this._productOffersCached;
      });
  }


}
