import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NomenclatureModel } from '#shared/modules';
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

  @Input() nomenclature: NomenclatureModel;

  get imageUrls(): string[] {
    if (this.nomenclature.imageUrls.length > 10) {
      // todo Чтобы не переделывать компанент карусели, решили что будем ПОКА отображать максимум 10 изображений
      return this.nomenclature.imageUrls.slice(0, 10);
    }
    return this.nomenclature.imageUrls;
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  firstImageUrl(imgs: string[]) {
    return imgs ? this.imageUrl(imgs[0]) : this.imageUrl(null);
  }

  imageUrl(img: string): string {
    return absoluteImagePath(img);
  }

}
