import { Pipe, PipeTransform } from '@angular/core';
import { absoluteImagePath } from '#shared/utils';


@Pipe({
  name: 'marketImageUrl',
})
export class ImageUrlPipe implements PipeTransform {
  transform(images: string[]): string {
    return images?.length ? absoluteImagePath(images[0]) : './assets/img/svg/clean.svg';;
  }
}

