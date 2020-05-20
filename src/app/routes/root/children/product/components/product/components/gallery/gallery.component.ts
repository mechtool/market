import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ImagesLinkModel, ProductModel } from '#shared/modules';
import { absoluteImagePath } from '#shared/utils/get-image';

@Component({
  selector: 'my-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: [
    './gallery.component.scss',
    './gallery.component-768.scss'
  ],
})
export class GalleryComponent implements OnInit, OnDestroy {

  @Input() product: ProductModel;

  get images(): ImagesLinkModel[] {
    if (this.product.images.length > 10) {
      // todo Чтобы не переделывать компанент карусели, решили что будем ПОКА отображать максимум 10 изображений
      return this.product.images.slice(0, 10);
    }
    return this.product.images;
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
