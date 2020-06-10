import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import {
  ImagesLinkModel,
  LocalStorageService,
  SuggestionCategoryItemModel,
  SuggestionProductItemModel,
} from '../../../../common-services';
import { Router } from '@angular/router';

@Component({
  selector: 'my-search-bar-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarProductsComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  @Input() products: SuggestionProductItemModel[];
  @Input() categories: SuggestionCategoryItemModel[];

  constructor(
    private _router: Router,
    private _localStorageService: LocalStorageService,
  ) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  chooseProduct(product: SuggestionProductItemModel) {
    this._localStorageService.putSearchProduct(product);
    this._router.navigate([`./product/${product.id}`]);
  }

  chooseCategory(category: SuggestionCategoryItemModel) {
    this._localStorageService.putSearchCategory(category);
    this._router.navigate([`./category/${category.id}`]);
  }

  imageUrl(image: ImagesLinkModel[]): string {
    return image ? image[0].href : 'assets/img/tmp/no_photo.png';
  }

}
