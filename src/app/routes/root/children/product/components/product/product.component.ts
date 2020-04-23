import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject, throwError } from 'rxjs';
import { BreadcrumbsService } from '../../../../components/breadcrumbs/breadcrumbs.service';
import { ProductService } from '#shared/modules/common-services/product.service';
import { ActivatedRoute } from '@angular/router';
import { NomenclatureModel, OffersModel } from '#shared/modules';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  nomenclature: NomenclatureModel;
  offers: OffersModel[];

  constructor(
    private _breadcrumbsService: BreadcrumbsService,
    private _productService: ProductService,
    private _activatedRoute: ActivatedRoute,
  ) {
    this._initNomenclature();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  private _initNomenclature() {
    combineLatest([this._activatedRoute.params])
      .pipe(
        switchMap(([params]) => {
          const nomenclatureId = params.id;
          return this._productService.getNomenclature(nomenclatureId);
        }),
        catchError((err) => {
          console.error('error', err);
          return throwError(err);
        }),
      )
      .subscribe((model) => {
        this.nomenclature = model.nomenclature;
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
        label: this.nomenclature.productName,
        routerLink: `/product/${this.nomenclature.id}`
      },
    ]);
  }
}
