import { Component, OnInit } from '@angular/core';
import { ProductService } from '#shared/modules/common-services/product.service';
import { ProductOffersModel } from '#shared/modules/common-services/models';
import { UntilDestroy } from '@ngneat/until-destroy';
import { NotificationsService } from '#shared/modules';

// TODO ВЫНЕСТИ В SHARED ПАПКУ!!!!!!!!!!!!!!!!!!!!!!!
@UntilDestroy({ checkProperties: true })
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
export class MainPopularComponent implements OnInit {
  productOffers: ProductOffersModel[];

  constructor(
    private _productService: ProductService,
    private _notificationsService: NotificationsService,
  ) {
  }

  ngOnInit() {
    this._getPopularNomenclatures();
  }


  private _getPopularNomenclatures(): void {
    this._productService.getPopularProductOffers()
      .subscribe((products) => {
        this.productOffers = products._embedded.productOffers;
      }, (err) => {
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      });
  }

}
