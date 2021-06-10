import { Component, OnDestroy } from '@angular/core';
import { combineLatest, throwError } from 'rxjs';
import {
  CartPromoterService,
  ExternalProvidersService,
  NotificationsService,
  ProductService,
  TradeOfferResponseModel,
  TradeOffersService,
} from '#shared/modules/common-services';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDto, SortModel, TradeOfferDto, TradeOffersModel } from '#shared/modules/common-services/models';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { DeclensionPipe } from '#shared/modules/pipes/declension.pipe';
import { UntilDestroy } from '@ngneat/until-destroy';
import { currencyCode } from '#shared/utils';

@UntilDestroy({ checkProperties: true })
@Component({
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss', './product.component-992.scss'],
})
export class ProductComponent implements OnDestroy {
  productId: string;
  product: ProductDto;
  tradeOffer: TradeOfferResponseModel;
  tradeOffers: TradeOfferDto[];
  sort: SortModel;
  offersFoundInUserRegion: boolean;

  get hasProductDescription(): boolean {
    return !(this.product.productDescription || this.product.features?.length);
  }

  get offerTotal(): string {
    return this.tradeOffers ? this._offerTotal(this.tradeOffers.length) : '0 предложений';
  }

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _declensionPipe: DeclensionPipe,
    private _productService: ProductService,
    private _tradeOffersService: TradeOffersService,
    private _cartPromoterService: CartPromoterService,
    private _notificationsService: NotificationsService,
    private _externalProvidersService: ExternalProvidersService,
  ) {
    this._activatedRoute.queryParams.subscribe(
      (param) => {
        this.sort = param.sort ? param.sort : SortModel.ASC;
      },
      (err) => {
        this._notificationsService.error();
      },
    );
    this._initProductOffers();
  }

  ngOnDestroy(): void {
    this._cartPromoterService.stop();
  }

  sortChange($event: SortModel) {
    this.sort = $event;
    this._router.navigate([`/product/${this.productId}`], {
      queryParams: {
        sort: $event,
      },
    });
  }

  madeOrder(isMadeOrder: boolean) {
    if (isMadeOrder) {
      this._cartPromoterService.start();
    } else {
      this._cartPromoterService.stop();
    }
  }

  private _initProductOffers() {
    combineLatest([this._activatedRoute.params])
      .pipe(
        switchMap(([params]) => {
          this.productId = params.id;
          this.offersFoundInUserRegion = true;
          return this._productService.getProductOffer(this.productId, true);
        }),
        catchError((err) => {
          if (err.status === 404) {
            this.offersFoundInUserRegion = false;
            return this._productService.getProductOffer(this.productId);
          }
          return throwError(err);
        }),
        tap((model) => {
          const tag = {
            ecommerce: {
              currencyCode: model?.offers?.[0].currency?.code ? currencyCode(model.offers[0].currency.code) : 'RUB',
              impressions:
                model?.offers?.map((offer, index) => {
                  return {
                    name: model.product?.productName || '',
                    id: offer.sid || '',
                    price: offer.price ? offer.price / 100 : '',
                    brand: model.product?.manufacturer?.tradeMark || '',
                    category: model.product?.categoryName || '',
                    variant: offer.supplier?.name || '',
                    list: 'ProductMain',
                    position: index + 1,
                  };
                }) || [],
            },
          };
          this._externalProvidersService.fireGTMEvent(tag);
        }),
        switchMap((model) => {
          this.tradeOffers = this._mapOffers(model.offers);
          this.product = ProductDto.fromProductOffer(model.product);
          const tradeOfferId = this.offerWithMinPrice(this.tradeOffers);
          return this._tradeOffersService.get(tradeOfferId);
        }),
        catchError((err) => {
          return throwError(err);
        }),
      )
      .subscribe(
        (tradeOffer) => {
          this.tradeOffer = tradeOffer;
        },
        (err) => {
          if (err.status === 404) {
            this._router.navigate(['/404']);
          } else {
            this._notificationsService.error();
          }
        },
      );
  }

  private _offerTotal(value: number): string {
    return `${value} ${this._declensionPipe.transform(value, 'предложение', 'предложения', 'предложений')}`;
  }

  private _mapOffers(offers: TradeOffersModel[]): TradeOfferDto[] {
    return offers.map((offer) => {
      return TradeOfferDto.fromTradeOffer(offer);
    });
  }

  private offerWithMinPrice(tradeOffers: TradeOfferDto[]): string {
    if (tradeOffers.length === 1) {
      return tradeOffers[0].id;
    }
    return [...tradeOffers].sort((one, two) => one.price - two.price)[0].id;
  }
}
