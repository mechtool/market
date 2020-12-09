import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { CategoryModel, ProductOffersModel, SortModel } from '#shared/modules/common-services/models';
import { ActivatedRoute } from '@angular/router';
import { containParameters, hasRequiredParameters } from '#shared/utils';
import { MAX_VALUE } from '#shared/modules/pipes/found.pipe';
import { combineLatest, of, throwError } from 'rxjs';
import {
  ExternalProvidersService,
  NotificationsService,
  ProductService,
  SpinnerService
} from '#shared/modules/common-services';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { CardComponent } from '#shared/modules/components/card';

enum Scroll {
  DOWN, UP
}


@Component({
  selector: 'market-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: [
    './search-results.component.scss',
    './search-results.component-992.scss',
    './search-results.component-768.scss',
    './search-results.component-576.scss',
  ],
})
export class SearchResultComponent implements OnInit, AfterViewInit {
  sort: SortModel;
  queryParams: any;
  visibleSort = false;
  productsTotal: number;
  wasRequestProducts: boolean;
  productOffers: ProductOffersModel[];

  @Input() category: CategoryModel;
  @Input() popularComponentHeight: number;
  @Input() bannersComponentHeight: number;
  @Input() categoryListComponentHeight: number;

  @Output() pageChanged: EventEmitter<number> = new EventEmitter();
  @Output() visibleBanners: EventEmitter<boolean> = new EventEmitter();
  @Output() sortingChanged: EventEmitter<SortModel> = new EventEmitter();

  @ViewChild('productInfiniteScroll') elementProductInfiniteScroll: ElementRef;
  @ViewChildren(CardComponent, { read: ElementRef }) elementMarketCard: QueryList<ElementRef>;

  private page: number;
  private translateY = 0;
  private isLastPage = false;
  private requestDenied = true;
  private scroll = Scroll.DOWN;
  private height30ProductCards = 0;
  private productCountInRequest = 30;
  private scrollEnabled = true;

  get transform() {
    return `transform: translateY(${this.translateY}px);`
  }

  get showResult() {
    if (this.productOffers?.length) {
      return 'notEmptyResults';
    }
    if (this.category && this.wasRequestProducts) {
      return 'emptyResultsAndCategoryPage';
    }
    if (this.wasRequestProducts) {
      return 'emptyResults';
    }
  }

  get foundCount() {
    return this.productsTotal < MAX_VALUE ? this.productsTotal : MAX_VALUE;
  }

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _productService: ProductService,
    private _spinnerService: SpinnerService,
    private _notificationsService: NotificationsService,
    private _externalProvidersService: ExternalProvidersService,
  ) {
  }

  ngOnInit(): void {
    this._productRequest();
  }

  ngAfterViewInit(): void {
    this.scrollEnabled = false;
    this._addEmptySpaceAboveProductCards(200).then(() => {
    });
  }

  sortChange(sort: SortModel) {
    this.sortingChanged.emit(sort);
  }

  onScroll($event: any) {
    if (this.scrollEnabled && !this.isLastPage && this.requestDenied && this._scrollPositionLtePageInnerHeight()) {
      this.requestDenied = false;
      this.scroll = Scroll.DOWN;
      this.pageChanged.emit(+this.page + 1);
    }

    if (this.scrollEnabled && this.page > 0 && this.requestDenied && this._scrollPositionNextToEmptySpace()) {
      this.requestDenied = false;
      this.scroll = Scroll.UP;
      this.pageChanged.emit(+this.page - 1);
    }
  }

  private async _addEmptySpaceAboveProductCards(logout: number) {
    if (!this.wasRequestProducts || logout < 0) {
      return;
    }

    if (this.elementProductInfiniteScroll && this.elementMarketCard) {
      this.height30ProductCards = this.elementProductInfiniteScroll?.nativeElement?.offsetHeight;

      this.translateY = this.page * this.height30ProductCards;

      if (this.translateY > 0) {
        await this._sleep(50).then(() => {
          this.elementMarketCard?.first?.nativeElement.scrollIntoView({ block: 'start' });
          this.scrollEnabled = true
        });
      } else {
        this.scrollEnabled = true;
      }

      return;
    }

    await this._sleep(10).then(() => this._addEmptySpaceAboveProductCards(--logout));
  }

  private _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private _productRequest() {
    combineLatest([this._activatedRoute.params, this._activatedRoute.queryParams])
      .pipe(
        filter(([params, queryParams]) => {
          // todo Удалить когда избавимся от ?showCategories=true при вызове каталога
          // todo Данный костыль не решает проблему полностью, теперь вместо двух запросов - выполняется один
          return queryParams.showCategories !== 'true'
        }),
        switchMap(([params, queryParams]) => {
          this._spinnerService.show();

          this.wasRequestProducts = containParameters(queryParams) || !!params.categoryId;
          this.queryParams = queryParams;

          const newFilters = {
            supplierId: queryParams.supplierId,
            trademark: queryParams.trademark,
            isDelivery: queryParams.isDelivery !== 'false',
            isPickup: queryParams.isPickup !== 'false',
            inStock: queryParams.inStock,
            withImages: queryParams.withImages,
            priceFrom: queryParams.priceFrom,
            priceTo: queryParams.priceTo,
            categoryId: params.categoryId || queryParams.categoryId,
          };

          this.page = +queryParams.page || 0;

          if (hasRequiredParameters({ query: queryParams.q, filters: newFilters })) {
            return this._productService.searchProductOffers({
              query: queryParams.q,
              filters: newFilters,
              page: this.page,
              size: 30,
              sort: queryParams.sort,
            });
          }
          return of({
            page: null,
            _embedded: null,
          });
        }),
        tap((productOffers) => {
          const topProductIDs = productOffers._embedded?.productOffers?.slice(0, 3)?.map((productOffer) => productOffer?.product?.id) || [];
          const tag = {
            event: 'ListingPage',
            products: topProductIDs,
          };
          this._externalProvidersService.fireGTMEvent(tag);
        }),
        catchError((err) => {
          return throwError(err);
        }),
      )
      .subscribe((productOffers) => {
          this.isLastPage = (productOffers.page?.number + 1) === productOffers.page?.totalPages
          this.productsTotal = productOffers.page?.totalElements || 0;
          this.visibleBanners.emit(this.productsTotal === 0)
          this.visibleSort = productOffers._embedded?.productOffers?.length > 1
          this._add(productOffers._embedded?.productOffers)
          this._spinnerService.hide();
        },
        (err) => {
          this._spinnerService.hide();
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );
  }

  private _add(products: ProductOffersModel[]) {
    if (!products?.length || !this.productOffers || (this.translateY === 0 && this.productOffers?.length && this.page === 0)) {
      // todo Если после загрузки страницы просто меняют сортировку ИЛИ если ничего не найденно, то удаляем ранее найденные товары
      this.productOffers = [];
    }

    if (products?.length) {

      this.productCountInRequest = products?.length;

      if (this.scroll === Scroll.DOWN) {
        this.productOffers.push(...products);

        if (this.productOffers?.length > 60) {
          this.productOffers.splice(0, 30);
          this.translateY = this.height30ProductCards * (this.page - 1);
        }

        this.requestDenied = true;
      }

      if (this.scroll === Scroll.UP) {
        this.productOffers.unshift(...products);
        this.translateY = this.height30ProductCards * this.page;

        if (this.productOffers?.length > 60) {
          this.productOffers.splice(60, this.productCountInRequest);
        }

        this.requestDenied = true;
      }
    }
  }

  private _scrollPositionLtePageInnerHeight(): boolean {
    return document.documentElement.scrollTop > 0 &&
      (document.documentElement.scrollHeight - document.documentElement.scrollTop - 50) <= window.innerHeight;
  }

  private _scrollPositionNextToEmptySpace(): boolean {
    const emptySpace = +this.elementProductInfiniteScroll?.nativeElement.style.transform?.replace('translateY(', '').replace('px)', '');
    if (this.category) {
      const popular = this.popularComponentHeight || 0;
      const banners = this.bannersComponentHeight || 0;
      const category = this.categoryListComponentHeight || 0;
      return document.documentElement.scrollTop > 0 &&
        (document.documentElement.scrollTop - emptySpace - popular - banners - category - 285) < 0;
    }

    return document.documentElement.scrollTop > 0 && (document.documentElement.scrollTop - emptySpace - 150) < 0;
  }

}
