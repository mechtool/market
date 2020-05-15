import { environment } from '#environments/environment';

const IMG_URL = environment.imgUrl;
const CATALOG_PIC = 'https://catalog-pic.1c.ru';
const NO_PHOTO = 'assets/img/tmp/no_photo.png';
const LIGHTNING = 'assets/img/tmp/lightning.png';
const QUICK_SEARCH_HISTORY = 'assets/img/svg/quick_search_history.svg';

export function absoluteImagePath(img: string): string {
  if (!img) {
    return NO_PHOTO;
  }
  if (img.includes(CATALOG_PIC)) {
    return img;
  }
  return `${IMG_URL}${img}`;
}

export function isAssetsImg(img: string): boolean {
  return img.includes(NO_PHOTO) || img.includes(QUICK_SEARCH_HISTORY) ||  img.includes(LIGHTNING);
}
