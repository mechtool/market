import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject, throwError } from 'rxjs';
import { BreadcrumbsService } from '../../../../components/breadcrumbs/breadcrumbs.service';
import { ProductService } from '#shared/modules/common-services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TradeOffersModel, ProductModel, SortModel, TradeOfferInfoModel } from '#shared/modules';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  product: ProductModel;
  offers: TradeOffersModel[];
  tradeOffers: TradeOfferInfoModel[];
  sort: SortModel;


  constructor(
    private _breadcrumbsService: BreadcrumbsService,
    private _productService: ProductService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
  ) {
    this._activatedRoute.queryParams.subscribe((param) => {
      this.sort = param.sort ? param.sort : SortModel.ASC;
    });
    this._initNomenclature();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  sortChange($event: SortModel) {
    this.sort = $event;
    this._router.navigate([`/product/${this.product.id}`], {
      queryParams: {
        sort: $event,
      }
    });
  }

  private _initNomenclature() {
    combineLatest([this._activatedRoute.params])
      .pipe(
        switchMap(([params]) => {
          const productId = params.id;
          return this._productService.getProductOffer(productId);
        }),
        catchError((err) => {
          console.error('error', err);
          return throwError(err);
        }),
      )
      .subscribe((model) => {
        this.tradeOffers = this._mapOffers(model.offers);
        this.product = model.product;
        this.offers = model.offers;
        this._initBreadcrumbs();
      }, (err) => {
        console.error('error', err);
      });
  }

  private _initBreadcrumbs() {
    this._breadcrumbsService.setVisible(true);
    this._breadcrumbsService.setItems([
      {
        label: 'Личный кабинет',
        routerLink: '/'
      },
      {
        label: 'Продукты',
      },
      {
        label: this.product.productName,
        routerLink: `/product/${this.product.id}`
      },
    ]);
  }

  private _mapOffers(offers: TradeOffersModel[]): TradeOfferInfoModel[] {
    return offers.map((offer) => {
      return {
        id: offer.id,
        description: 'Описание специальных условия от поставщика, которые у него находятся в специальной вкладке' +
          ' и выводится первые четыре строки этой инфы',
        price: offer.price,
        stock: 679, // todo пока негде взять!!!
        supplierId: offer.supplier.id,
        supplierName: offer.supplier.name,
        isSpecialPrice: true,
      };
    });
  }
}
