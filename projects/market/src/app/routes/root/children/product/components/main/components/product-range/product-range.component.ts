import { Component, OnDestroy } from '@angular/core';
import { BNetService, ProductsHighlightResponseModel, ResponsiveService } from '#shared/modules';
import { Subscription } from 'rxjs';
import { absoluteImagePath, unsubscribeList } from '#shared/utils';

@Component({
  selector: 'market-product-range',
  templateUrl: './product-range.component.html',
  styleUrls: ['./product-range.component.scss'],
})
export class ProductRangeComponent implements OnDestroy {

  private readonly _innerWidthSubscription: Subscription;
  count: number;
  productsHighlight: ProductsHighlightResponseModel[];

  constructor(
    private _bnetService: BNetService,
    private _responsiveService: ResponsiveService
  ) {

    this._bnetService.getProductsHighlight()
      .subscribe((res) => {
        this.productsHighlight = res._embedded.items;
      })

    this._innerWidthSubscription = this._responsiveService.screenWidth$.subscribe((innerWidth) => {
      if (innerWidth <= 576) {
        this.count = 1;
      } else if (innerWidth > 576 && innerWidth <= 992) {
        this.count = 2;
      } else {
        this.count = 3
      }
    });
  }

  ngOnDestroy(): void {
    unsubscribeList([this._innerWidthSubscription]);
  }

  imageUrl(img: string): string {
    return absoluteImagePath(img);
  }
}
