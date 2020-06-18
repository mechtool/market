import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ImagesLinkModel, ProductDto } from '#shared/modules/common-services/models';
import { absoluteImagePath, mapStock } from '#shared/utils';

@Component({
  selector: 'my-product-gallery',
  templateUrl: './product-gallery.component.html',
  styleUrls: [
    './product-gallery.component.scss',
    './product-gallery.component-768.scss'
  ],
})
export class ProductGalleryComponent implements OnInit, OnDestroy {

  @Input() product: ProductDto;
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

  constructor() {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  firstImageUrl(imgs: ImagesLinkModel[]) {
    return imgs ? this.imageUrl(imgs[0].href) : this.imageUrl(null);
  }

  imageUrl(img: string): string {
    return absoluteImagePath(img);
  }

}
