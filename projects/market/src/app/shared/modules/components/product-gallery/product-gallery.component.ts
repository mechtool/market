import { Component, Input } from '@angular/core';
import { ImagesLinkModel, ProductDto } from '#shared/modules/common-services/models';
import { absoluteImagePath, mapStock, resizeBusinessStructure } from '#shared/utils';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-product-gallery',
  templateUrl: './product-gallery.component.html',
  styleUrls: [
    './product-gallery.component.scss',
    './product-gallery.component-768.scss'
  ],
})
export class ProductGalleryComponent {

  @Input() product: ProductDto;
  @Input() supplierId: string;
  @Input() supplierName: string;
  @Input() stock: string;
  @Input() supplierLogo: string;

  get images(): ImagesLinkModel[] {
    if (this.product.images.length > 10) {
      // todo Чтобы не переделывать компанент карусели, решили что будем ПОКА отображать максимум 10 изображений
      return this.product.images.slice(0, 10);
    }
    return this.product.images;
  }

  get stockLevel() {
    return mapStock(this.stock);
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
