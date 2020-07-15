import { Component } from '@angular/core';
import { throwError } from 'rxjs';
import {
  ProductDto,
  SuppliersItemModel,
  TradeOfferResponseModel,
  TradeOfferSupplierModel
} from '#shared/modules/common-services/models';
import { OrganizationsService, ProductService, TradeOffersService, } from '#shared/modules/common-services';
import { ActivatedRoute } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import { stringToRGB } from '#shared/utils';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  templateUrl: './trade-offer.component.html',
  styleUrls: [
    './trade-offer.component.scss',
    './trade-offer.component-992.scss',
  ],
})
export class TradeOfferComponent {
  product: ProductDto;
  supplier: SuppliersItemModel;
  supplierLogo: string;
  tradeOffer: TradeOfferResponseModel;

  get hasProductDescription(): boolean {
    return !(this.product.productDescription || this.product.features?.length);
  }

  constructor(
    private _productService: ProductService,
    private _tradeOffersService: TradeOffersService,
    private _organizationsService: OrganizationsService,
    private _activatedRoute: ActivatedRoute,
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
        catchError((err) => {
          console.error('error', err);
          return throwError(err);
        }),
      )
      .subscribe((tradeOffer) => {
        this.tradeOffer = tradeOffer;
        this.product = ProductDto.fromTradeOffer(tradeOffer);
        this.supplier = this._mapSupplier(tradeOffer.supplier);
        this.supplierLogo = stringToRGB(this.supplier.id);
      }, (err) => {
        console.error('error', err);
      });
  }

  private _mapSupplier(supplier: TradeOfferSupplierModel): SuppliersItemModel {
    return {
      id: supplier.bnetInternalId,
      name: supplier.name,
      inn: supplier.inn,
      kpp: supplier.kpp,
      description: `Описание организации ${supplier.name} являющейся поставщиком в сервисе 1С:Бизнес-Сеть`, // todo пока не приходит, не забыть убрать
      email: supplier.contactPerson?.email,
      phone: supplier.contactPerson?.phone,
      personName: supplier.contactPerson?.name,
    };
  }
}