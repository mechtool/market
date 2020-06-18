import { Component } from '@angular/core';
import { combineLatest, throwError } from 'rxjs';
import { ProductService } from '#shared/modules/common-services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDto, SortModel, TradeOfferDto, TradeOffersModel } from '#shared/modules';
import { catchError, switchMap } from 'rxjs/operators';
import { DeclensionPipe } from '#shared/modules/pipes/declension.pipe';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
  productId: string;
  product: ProductDto;
  tradeOffers: TradeOfferDto[];
  sort: SortModel;

  get hasProductDescription(): boolean {
    return !(this.product.productDescription || this.product.features?.length);
  }

  get offerTotal(): string {
    return this.tradeOffers ? this._offerTotal(this.tradeOffers.length) : '0 предложений';
  }

  constructor(
    private _productService: ProductService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _declensionPipe: DeclensionPipe,
  ) {
    this._activatedRoute.queryParams.subscribe((param) => {
      this.sort = param.sort ? param.sort : SortModel.ASC;
    });
    this._initProductOffers();
  }


  sortChange($event: SortModel) {
    this.sort = $event;
    this._router.navigate([`/product/${this.productId}`], {
      queryParams: {
        sort: $event,
      }
    });
  }

  private _initProductOffers() {
    combineLatest([this._activatedRoute.params])
      .pipe(
        switchMap(([params]) => {
          this.productId = params.id;
          return this._productService.getProductOffer(this.productId);
        }),
        catchError((err) => {
          console.error('error', err);
          return throwError(err);
        }),
      )
      .subscribe((model) => {
        this.tradeOffers = this._mapOffers(model.offers);
        this.product = ProductDto.fromProductOffer(model.product);
      }, (err) => {
        console.error('error', err);
      });
  }

  private _offerTotal(value: number): string {
    return `${value} ${this._declensionPipe.transform(value, 'предложение', 'предложения', 'предложений')}`;
  }

  private _mapOffers(offers: TradeOffersModel[]): TradeOfferDto[] {
    return offers.map((offer) => {
      return TradeOfferDto.fromTradeOffer(offer);
    });
  }
}
