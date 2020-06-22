import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import {
  ProductDto,
  SuppliersItemModel,
  TradeOfferResponseModel,
  TradeOfferSupplierModel
} from '#shared/modules/common-services/models';
import { BreadcrumbsService } from '../../../../components/breadcrumbs/breadcrumbs.service';
import { OrganizationsService, ProductService, TradeOffersService, } from '#shared/modules/common-services';
import { ActivatedRoute } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import { randomARGB } from '#shared/utils';


@Component({
  templateUrl: './trade-offer.component.html',
  styleUrls: [
    './trade-offer.component.scss',
    './trade-offer.component-992.scss',
  ],
})
export class TradeOfferComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  product: ProductDto;
  supplier: SuppliersItemModel;
  supplierLogo: string;
  tradeOffer: TradeOfferResponseModel;

  get hasProductDescription(): boolean {
    return !(this.product.productDescription || this.product.features?.length);
  }

  constructor(
    private _breadcrumbsService: BreadcrumbsService,
    private _productService: ProductService,
    private _tradeOffersService: TradeOffersService,
    private _organizationsService: OrganizationsService,
    private _activatedRoute: ActivatedRoute,
  ) {
    this.supplierLogo = randomARGB();
    this._initTradeOffer();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
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
        this._initBreadcrumbs();
      }, (err) => {
        console.error('error', err);
      });
  }

  private _initBreadcrumbs() {
    this._breadcrumbsService.setVisible(true);
    this._breadcrumbsService.setItems([
      {
        label: 'Поставщики',
        routerLink: '/supplier'
      },
      {
        label: `${this.supplier.name}`,
        routerLink: `/supplier/${this.supplier.id}/offer`
      },
      {
        label: this.product?.productName,
        routerLink: `/supplier/${this.supplier.id}/offer/${this.tradeOffer.id}`
      },
    ]);
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
