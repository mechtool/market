import { environment } from '#environments/environment';

const IMG_URL = environment.imgUrl;
const CATALOG_PIC = 'https://catalog-pic.1c.ru';


export function absoluteImagePath(img: string): string {
  if (!img) {
    return 'assets/img/tmp/no_photo.png';
  }
  if (img.includes(CATALOG_PIC)) {
    return img;
  }
  return `${IMG_URL}${img}`;
}
