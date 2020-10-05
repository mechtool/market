import { Component, Input } from '@angular/core';
import { ImagesLinkModel, ProductDto, TradeOfferStockEnumModel } from '#shared/modules/common-services/models';
import { absoluteImagePath, resizeBusinessStructure } from '#shared/utils';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-product-gallery',
  templateUrl: './product-gallery.component.html',
  styleUrls: ['./product-gallery.component.scss', './product-gallery.component-768.scss'],
})
export class ProductGalleryComponent {
  @Input() product: ProductDto;
  @Input() supplierId: string;
  @Input() supplierName: string;
  @Input() stockLevel: TradeOfferStockEnumModel;
  @Input() stockAmount: number;
  @Input() temporarilyOutOfSales: boolean;
  @Input() supplierLogo: string;

  get images(): ImagesLinkModel[] {
    if (this.product.images?.length > 10) {
      // todo Чтобы не переделывать компонент карусели, решили что будем ПОКА отображать максимум 10 изображений
      return this.product.images.slice(0, 10);
    }
    return this.product.images || null;
  }

  get name() {
    return resizeBusinessStructure(this.supplierName);
  }

  constructor() {
  }

  firstImageUrl(imgs: ImagesLinkModel[]) {
    return imgs?.length ? this.imageUrl(imgs[0].href) : null;
  }

  imageUrl(img: string): string {
    return absoluteImagePath(img);
  }
}
