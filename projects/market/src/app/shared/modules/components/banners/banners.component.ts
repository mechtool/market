import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BannerItemModel } from './models';
import { combineLatest, fromEvent, interval, Observable, Subject } from 'rxjs';
import { delay, distinctUntilChanged, take, takeWhile, tap } from 'rxjs/operators';
import { ResponsiveService } from '#shared/modules/common-services/responsive.service';
import { NavigationService } from '#shared/modules/common-services/navigation.service';

@Component({
  selector: 'market-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss', './banners.component-768.scss'],
})
export class BannersComponent implements OnInit {
  @Input() bannerItems: BannerItemModel[];
  @Input() autoPlay = true;
  bannerItemsGroups: BannerItemModel[][];
  carouselEnabled = false;
  groupDivider: number = null;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _cdr: ChangeDetectorRef,
    private _responsiveService: ResponsiveService,
    private _navService: NavigationService
  ) {}

  ngOnInit() {
    this._handleCarouselVisibility();

    const body = this._document.body;
    const source$ = interval(30);
    source$.pipe(
      takeWhile(() => body.scrollHeight > body.clientHeight),
      take(1)
    ).subscribe((res) => {
      this._reinitChildComponent();
    })

  }

  private _reinitChildComponent(): void{
    if (this.carouselEnabled) {
      this.carouselEnabled = false;
      this._cdr.detectChanges();
      this.carouselEnabled = true;
      this._cdr.detectChanges();
    }
  }

  private _handleCarouselVisibility() {
    combineLatest([this._isNavBarMinifiedChange$(), this._screenWidthChange$()]).subscribe(([isNavBarMinified, screenWidth]) => {
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
