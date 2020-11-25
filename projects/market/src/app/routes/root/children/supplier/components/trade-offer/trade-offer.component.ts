import { Component } from '@angular/core';
import { throwError } from 'rxjs';
import { ProductDto, SuppliersItemModel, TradeOfferResponseModel, TradeOfferSupplierModel } from '#shared/modules/common-services/models';
import {
  ExternalProvidersService,
  NotificationsService,
  OrganizationsService,
  ProductService,
  TradeOffersService,
} from '#shared/modules/common-services';
import { ActivatedRoute } from '@angular/router';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  templateUrl: './trade-offer.component.html',
  styleUrls: ['./trade-offer.component.scss', './trade-offer.component-992.scss'],
})
export class TradeOfferComponent {
  product: ProductDto;
  supplier: SuppliersItemModel;
  tradeOffer: TradeOfferResponseModel;

  get hasProductDescription(): boolean {
    return !(this.product.productDescription || this.product.features?.length);
  }

  constructor(
    private _productService: ProductService,
    private _tradeOffersService: TradeOffersService,
    private _organizationsService: OrganizationsService,
    private _activatedRoute: ActivatedRoute,
    private _notificationsService: NotificationsService,
    private _externalProvidersService: ExternalProvidersService,
  ) {
    this._initTradeOffer();
  }

  private _initTradeOffer() {
    this._activatedRoute.params
      .pipe(
        switchMap((params) => {
          const tradeOfferId = params.tradeOfferId;
          return this._tradeOffersService.get(tradeOfferId);
        }),
        tap((tradeOffer) => {
          const tag = {
            event: 'ProductPage',
            ecommerce: {
              detail: {
                products: [
                  {
                    name: tradeOffer.offerDescription?.title || '',
                    id: tradeOffer.id || '',
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
        catchError((err) => {
          return throwError(err);
        }),
      )
      .subscribe(
        (tradeOffer) => {
          this.tradeOffer = tradeOffer;
          this.product = ProductDto.fromTradeOffer(tradeOffer);
          this.supplier = this._mapSupplier(tradeOffer.supplier);
        },
        (err) => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );
  }

  private _mapSupplier(supplier: TradeOfferSupplierModel): SuppliersItemModel {
    return {
      id: supplier.bnetInternalId,
      name: supplier.name,
      inn: supplier.inn,
      kpp: supplier.kpp,
      description: supplier.description, // todo пока не приходит
      email: supplier.contactPerson?.email,
      phone: supplier.contactPerson?.phone,
      personName: supplier.contactPerson?.name,
    };
  }
}
