import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import {
  ProductModel,
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
  templateUrl: './product.component.html',
  styleUrls: [
    './product.component.scss',
    './product.component-992.scss',
  ],
})
export class SupplierProductComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  product: ProductModel;
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
          const productId = params.productId;
          const supplierId = params.id;
          console.log('supplierId', supplierId);
          return this._productService.getProductOffer(productId, { suppliers: [supplierId] });
        }),
        switchMap((productOffer) => {
          this.product = productOffer.product;
          const tradeOfferId = productOffer.offers[0].id;
          return this._tradeOffersService.getTradeOffer(tradeOfferId);
        }),
        catchError((err) => {
          console.error('error', err);
          return throwError(err);
        }),
      )
      .subscribe((tradeOffer) => {
        this.tradeOffer = tradeOffer;
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
        routerLink: `/supplier/${this.supplier.id}/product`
      },
      {
        label: this.product?.productName,
        routerLink: `/supplier/${this.supplier.id}/product/${this.product.id}`
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
