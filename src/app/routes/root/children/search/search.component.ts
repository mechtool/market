import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ProductService } from '#shared/modules/common-services/product.service';
import { NomenclatureCardModel, SuggestionProductItemModel, SuggestionCategoryItemModel } from '#shared/modules/common-services/models';
import { SuggestionService } from '#shared/modules/common-services/suggestion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '#shared/modules/common-services/local.storage.service';

@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  searchFilters = {};
  searchedNomenclatures: NomenclatureCardModel[];
  totalSearchedNomenclaturesCount: number;
  productsSuggestions: SuggestionProductItemModel[];
  categoriesSuggestions: SuggestionCategoryItemModel[];
  query: string;

  constructor(
    private _route: ActivatedRoute,
    private _productService: ProductService,
    private _suggestionService: SuggestionService,
    private _router: Router,
    private _localStorageService: LocalStorageService,
  ) {
    this._route.queryParams.subscribe((res) => {
      this.query = res.q;
      this.searchNomenclatures();
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  searchSuggestions(e: string) {
    this._suggestionService.searchSuggestions(e)
      .subscribe((res) => {
        this.productsSuggestions = res.products;
        this.categoriesSuggestions = res.categories;
      }, (err) => {
        console.log('error');
      });
  }

  searchNomenclatures(): void {
    this._productService.searchNomenclatureCards()
      .subscribe((res) => {
        this.searchedNomenclatures = res._embedded.items;
        this.totalSearchedNomenclaturesCount = res.page.totalElements;
      }, (err) => {
        console.log('error');
      });
  }

  navigateToSearchRoute(e: string) {
    this._localStorageService.putSearchText(e);
    this._router.navigate(['/search'], {
      queryParams: {
        q: e,
      }
    });
  }

}
