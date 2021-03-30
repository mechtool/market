import { ChangeDetectorRef, Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BannerItemModel } from './models';
import { combineLatest, interval, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { unsubscribeList } from '#shared/utils';
import { BannerService, NavigationService, ResponsiveService } from '#shared/modules/common-services';

@Component({
  selector: 'market-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss', './banners.component-768.scss'],
})
export class BannersComponent implements OnDestroy {
  bannerItems: BannerItemModel[];
  bannerItemsGroups: BannerItemModel[][];
  carouselEnabled = false;
  groupDivider: number = null;
  @ViewChild(NzCarouselComponent) private _carouselRef: NzCarouselComponent;
  private _carouselVisibilitySubscription: Subscription;

  private get _body(): HTMLElement {
    return this._document.body;
  }

  constructor(
    private _cdr: ChangeDetectorRef,
    private _bannerService: BannerService,
    private _navService: NavigationService,
    private _responsiveService: ResponsiveService,
    @Inject(DOCUMENT) private _document: Document,
  ) {
    this._bannerService.getBanners()
      .subscribe((banners) => {
        this.bannerItems = banners._embedded.items;
        this._handleCarouselVisibility();
        this._detectScrollAppearanceAndReinitCarousel();
      });
  }

  ngOnDestroy() {
    unsubscribeList([this._carouselVisibilitySubscription]);
  }

  private _detectScrollAppearanceAndReinitCarousel() {
    const source$ = interval(100);
    const subscription = source$.subscribe(() => {
      if (this._carouselRef && this._body.scrollHeight > this._body.clientHeight) {
        subscription.unsubscribe();
        this._reinitCarousel();
      }
    })
  }

  private _reinitCarousel(): void {
    if (this.carouselEnabled) {
      this.carouselEnabled = false;
      this._cdr.detectChanges();
      this.carouselEnabled = true;
      this._cdr.detectChanges();
    }
  }

  private _handleCarouselVisibility() {
    this._carouselVisibilitySubscription = combineLatest([this._isNavBarMinifiedChange$(), this._screenWidthChange$()])
      .subscribe(([isNavBarMinified, screenWidth]) => {
        const maxItemsInCarouselGroup = 3;
        let carouselEnabled = false;
        let groupDivider = null;

        if (!isNavBarMinified) {
          if (screenWidth > 1580 && this.bannerItems.length <= maxItemsInCarouselGroup) {
            carouselEnabled = false;
          }
          if (screenWidth > 1580 && this.bannerItems.length > maxItemsInCarouselGroup) {
            carouselEnabled = true;
            groupDivider = 3;
          }
          if (screenWidth <= 1580 && screenWidth > 768 && this.bannerItems.length < maxItemsInCarouselGroup) {
            carouselEnabled = false;
          }
          if (screenWidth <= 1580 && screenWidth > 768 && this.bannerItems.length >= maxItemsInCarouselGroup) {
            carouselEnabled = true;
            groupDivider = 2;
          }
          if (screenWidth <= 768 && this.bannerItems.length === 1) {
            carouselEnabled = false;
          }
          if (screenWidth <= 768 && this.bannerItems.length !== 1) {
            carouselEnabled = true;
            groupDivider = 1;
          }
        }

        if (isNavBarMinified) {
          if (screenWidth > 1300 && this.bannerItems.length <= maxItemsInCarouselGroup) {
            carouselEnabled = false;
          }
          if (screenWidth > 1300 && this.bannerItems.length > maxItemsInCarouselGroup) {
            carouselEnabled = true;
            groupDivider = 3;
          }
          if (screenWidth <= 1300 && screenWidth > 768 && this.bannerItems.length < maxItemsInCarouselGroup) {
            carouselEnabled = false;
          }
          if (screenWidth <= 1300 && screenWidth > 768 && this.bannerItems.length >= maxItemsInCarouselGroup) {
            carouselEnabled = true;
            groupDivider = 2;
          }
          if (screenWidth <= 768 && this.bannerItems.length === 1) {
            carouselEnabled = false;
          }
          if (screenWidth <= 768 && this.bannerItems.length !== 1) {
            carouselEnabled = true;
            groupDivider = 1;
          }
        }

        this.carouselEnabled = carouselEnabled;
        if (carouselEnabled && groupDivider) {
          this.groupDivider = groupDivider;
          this._resetBannerItemsGroupsBy(groupDivider);
        }
      });
  }

  private _isNavBarMinifiedChange$(): Observable<boolean> {
    return this._navService.isNavBarMinified$.pipe(distinctUntilChanged());
  }

  private _screenWidthChange$(): Observable<number> {
    return this._responsiveService.screenWidth$;
  }

  private _resetBannerItemsGroupsBy(num = 2) {
    this.bannerItemsGroups = this._makeChunks(this.bannerItems, num);
  }

  private _makeChunks(array: any[], size: number): any[][] {
    if (!array.length) {
      return [];
    }
    const head = array.slice(0, size);
    const tail = array.slice(size);

    return [head, ...this._makeChunks(tail, size)];
  }
}
