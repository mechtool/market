import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ProductService } from '#shared/modules/common-services/product.service';
import { ProductOffersCardModel } from '#shared/modules/common-services/models';

@Component({
  selector: 'my-main-popular',
  templateUrl: './popular.component.html',
  styleUrls: [
    './popular.component.scss',
    './popular.component-992.scss',
    './popular.component-768.scss',
    './popular.component-576.scss',
  ],
})
export class MainPopularComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  productOffers: ProductOffersCardModel[];

  constructor(private _productService: ProductService) {}

  ngOnInit() {
    this._getPopularNomenclatures();
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  private _getPopularNomenclatures(): void {
    this._productService.getPopularProductOffers()
      .subscribe((products) => {
        this.productOffers = products.productOffers;
      }, (err) => {
        console.log('error');
      });
  }

}
