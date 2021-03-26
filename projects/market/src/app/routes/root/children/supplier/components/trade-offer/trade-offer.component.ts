import { Component, OnDestroy } from '@angular/core';
import { combineLatest, of, throwError } from 'rxjs';
import {
  CounterpartyResponseModel,
  ProductDto,
  SuppliersItemModel,
  TradeOfferResponseModel,
  TradeOfferSupplierModel
} from '#shared/modules/common-services/models';
import {
  CartPromoterService,
  ExternalProvidersService,
  NotificationsService,
  OrganizationsService,
  ProductService,
  TradeOffersService,
} from '#shared/modules/common-services';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Meta } from "@angular/platform-browser";

@UntilDestroy({ checkProperties: true })
@Component({
  templateUrl: './trade-offer.component.html',
  styleUrls: ['./trade-offer.component.scss', './trade-offer.component-992.scss'],
})
export class TradeOfferComponent implements OnDestroy {
  product: ProductDto;
  supplier: SuppliersItemModel;
  tradeOffer: TradeOfferResponseModel;

  get hasProductDescription(): boolean {
    return !(this.product.productDescription || this.product.features?.length);
  }

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _meta: Meta,
    private _productService: ProductService,
    private _tradeOffersService: TradeOffersService,
    private _cartPromoterService: CartPromoterService,
    private _organizationsService: OrganizationsService,
    private _notificationsService: NotificationsService,
    private _externalProvidersService: ExternalProvidersService,
  ) {
    this._initTradeOffer();
  }

  ngOnDestroy(): void {
    this._cartPromoterService.stop();
    this._meta.removeTag('itemprop="identifier"');
  }

  madeOrder(isMadeOrder: boolean) {
    if (isMadeOrder) {
      this._cartPromoterService.start();
    } else {
      this._cartPromoterService.stop();
    }
  }

  private _initTradeOffer() {
    this._activatedRoute.params
      .pipe(
        switchMap((params) => {
          return this._tradeOffersService.get(params.tradeOfferId);
        }),
        tap((tradeOffer) => {
          const tag = {
            event: 'ProductPage',
            ecommerce: {
              detail: {
                products: [
                  {
                    name: tradeOffer.product?.ref1cNomenclature?.productName || tradeOffer.product?.supplierNomenclature?.productName || '',
                    id: tradeOffer.sid || '',
                    price: tradeOffer.termsOfSale?.price?.matrix?.[0]?.price ? tradeOffer.termsOfSale.price.matrix[0].price / 100 : '',
                    brand:
                      tradeOffer.product?.ref1cNomenclature?.manufacturer?.tradeMark ||
                      tradeOffer.product?.supplierNomenclature?.manufacturer?.tradeMark ||
                      '',
                    category:
                      tradeOffer.product?.ref1cNomenclature?.categoryName ||
                      tradeOffer.product?.supplierNomenclature?.ref1Cn?.categoryName ||
                      '',
                    variant: tradeOffer.supplier?.name || '',
                  },
                ],
              },
            },
          };
          this._externalProvidersService.fireGTMEvent(tag);
        }),
        tap((tradeOffer) => {
          this._meta.updateTag({ itemprop: 'identifier', content: tradeOffer.sid});
        }),
        switchMap((tradeOffer) => {
          const inn = tradeOffer.supplier.inn;
          return combineLatest([of(tradeOffer), this._organizationsService.findCounterpartyDataByInn(inn)])
        }),
        catchError((err) => {
          return throwError(err);
        }),
      ).subscribe(([tradeOffer, counterparty]) => {
          this.tradeOffer = tradeOffer;
          this.product = ProductDto.fromTradeOffer(tradeOffer);
          this.supplier = this._mapSupplier(tradeOffer.supplier, counterparty);
        },
        (err) => {
          if (err.status === 404) {
            this._router.navigate(['/404']);
          } else {
            this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
          }
        },
      );
  }

  private _mapSupplier(supplier: TradeOfferSupplierModel, counterparty: CounterpartyResponseModel): SuppliersItemModel {
    return {
      id: supplier.bnetInternalId,
      name: supplier.name,
      inn: supplier.inn,
      kpp: supplier.kpp,
      description: supplier.description,
      email: supplier.contactPerson?.email,
      phone: supplier.contactPerson?.phone,
      personName: supplier.contactPerson?.name,
      publicInfo: counterparty,
      isVerifiedOrg: supplier.isVerifiedOrg,
    };
  }
}
