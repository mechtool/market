import { Component, Input, OnInit } from '@angular/core';
import { BannerItemModel } from './models';
import { combineLatest, fromEvent, Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { ResponsiveService } from '#shared/modules/common-services/responsive.service';
import { NavigationService } from '#shared/modules/common-services/navigation.service';

@Component({
  selector: 'market-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss', './banners.component-768.scss'],
})
export class BannersComponent implements OnInit {
  @Input() bannerItems: BannerItemModel[];
  bannerItemsGroups: BannerItemModel[][];
  showCarousel = false;
  groupDivider: number = null;

  constructor(private _responsiveService: ResponsiveService, private _navService: NavigationService) {}

  ngOnInit() {
    this._handleCarouselVisibility();
  }

  private _handleCarouselVisibility() {
    combineLatest([this._isNavBarMinifiedChange$(), this._screenWidthChange$()]).subscribe(([isNavBarMinified, screenWidth]) => {
      const maxItemsInCarouselGroup = 3;
      let showCarousel = false;
      let groupDivider = null;

      if (!isNavBarMinified) {
        if (screenWidth > 1580 && this.bannerItems.length <= maxItemsInCarouselGroup) {
          showCarousel = false;
        }
        if (screenWidth > 1580 && this.bannerItems.length > maxItemsInCarouselGroup) {
          showCarousel = true;
          groupDivider = 3;
        }
        if (screenWidth <= 1580 && screenWidth > 768 && this.bannerItems.length < maxItemsInCarouselGroup) {
          showCarousel = false;
        }
        if (screenWidth <= 1580 && screenWidth > 768 && this.bannerItems.length >= maxItemsInCarouselGroup) {
          showCarousel = true;
          groupDivider = 2;
        }
        if (screenWidth <= 768 && this.bannerItems.length === 1) {
          showCarousel = false;
        }
        if (screenWidth <= 768 && this.bannerItems.length !== 1) {
          showCarousel = true;
          groupDivider = 1;
        }
      }

      if (isNavBarMinified) {
        if (screenWidth > 1300 && this.bannerItems.length <= maxItemsInCarouselGroup) {
          showCarousel = false;
        }
        if (screenWidth > 1300 && this.bannerItems.length > maxItemsInCarouselGroup) {
          showCarousel = true;
          groupDivider = 3;
        }
        if (screenWidth <= 1300 && screenWidth > 768 && this.bannerItems.length < maxItemsInCarouselGroup) {
          showCarousel = false;
        }
        if (screenWidth <= 1300 && screenWidth > 768 && this.bannerItems.length >= maxItemsInCarouselGroup) {
          showCarousel = true;
          groupDivider = 2;
        }
        if (screenWidth <= 768 && this.bannerItems.length === 1) {
          showCarousel = false;
        }
        if (screenWidth <= 768 && this.bannerItems.length !== 1) {
          showCarousel = true;
          groupDivider = 1;
        }
      }

      this.showCarousel = showCarousel;
      if (showCarousel && groupDivider) {
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
