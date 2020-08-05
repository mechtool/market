import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  ImagesLinkModel,
  LocalStorageService,
  SuggestionCategoryItemModel,
  SuggestionProductItemModel,
} from '../../../../common-services';
import { Router } from '@angular/router';
import { absoluteImagePath } from '#shared/utils';

@Component({
  selector: 'market-search-bar-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarProductsComponent {
  @Input() products: SuggestionProductItemModel[];
  @Input() categories: SuggestionCategoryItemModel[];

  constructor(
    private _router: Router,
    private _localStorageService: LocalStorageService,
  ) {
  }

  chooseProduct(product: SuggestionProductItemModel) {
    this._localStorageService.putSearchProduct(product);
    this._router.navigate([`./product/${product.id}`]);
  }

  chooseCategory(category: SuggestionCategoryItemModel) {
    this._localStorageService.putSearchCategory(category);
    this._router.navigate([`./category/${category.id}`]);
  }

  imageUrl(images: ImagesLinkModel[]): string {
    return images ? absoluteImagePath(images[0].href) : absoluteImagePath(null);
  }

}
