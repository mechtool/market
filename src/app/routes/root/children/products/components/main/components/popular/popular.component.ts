import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ProductsService } from '../../../../services';
import { NomenclatureCardModel } from './../../../../models';

@Component({
  selector: 'c-main-popular',
  templateUrl: './popular.component.html',
  styleUrls: [
    './popular.component.scss',
    './popular.component-768.scss',
    './popular.component-576.scss',
  ],
})
export class MainPopularComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  nomenclatures: NomenclatureCardModel[];

  constructor(private _productsService: ProductsService) {}

  ngOnInit() {
    this._getPopularNomenclatures();
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  private _getPopularNomenclatures(): void {
    this._productsService.getPopularNomenclatureCards()
      .subscribe((res) => {
        this.nomenclatures = res;
      }, (err) => {
        console.log('error');
      });
  }

}
