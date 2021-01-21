import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {
  AllGroupQueryFiltersModel,
  SuppliersItemModel,
  SuppliersResponseModel
} from '#shared/modules/common-services/models';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { NotificationsService, SpinnerService, SupplierService } from '#shared/modules/common-services';
import { IPageInfo, VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { Location } from '@angular/common';
import { forkJoin } from 'rxjs';
import { addURLParameters, removeURLParameters, updateUrlParameters } from '#shared/utils';

const PAGE_SIZE = 60;

@Component({
  templateUrl: './suppliers.component.html',
  styleUrls: [
    './suppliers.component.scss',
    './suppliers.component-992.scss',
    './suppliers.component-768.scss',
    './suppliers.component-576.scss',
  ],
})
export class SupplierListComponent implements AfterViewInit {
  query: string;
  supplierData: SuppliersResponseModel;
  suppliers: SuppliersItemModel[] = [];
  private page: number;
  private pos: number;
  private unlocked = false;
  @ViewChild(VirtualScrollerComponent) private virtualScroller: VirtualScrollerComponent;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _supplierService: SupplierService,
    private _notificationsService: NotificationsService,
    private _spinnerService: SpinnerService,
    private _location: Location,
  ) {
    this._initForm();
  }

  ngAfterViewInit(): void {
    const index = +this._activatedRoute.snapshot.queryParamMap.get('pos');
    if (index) {
      this._scrollToIndex(index, 200).then(() => setTimeout(() => {
          this.unlocked = true;
        }, 1000)
      );
    } else {
      this.unlocked = true;
    }
  }

  changeQueryParameters($event: AllGroupQueryFiltersModel) {
    this.query = $event.query;
    this._router.navigate(['/supplier'], {
      queryParams: {
        q: $event.query,
      },
    });
  }

  loadSuppliers(event: IPageInfo) {
    if (this.unlocked) {
      const nextPage = Math.floor((event.endIndex + 1) / PAGE_SIZE);

      if (event.startIndex !== this.pos) {
        this.page = nextPage;
        this.pos = event.startIndex;
        this._changeQueryParamsPagePosInUrl(nextPage, event.startIndex);
      }

      if (nextPage > this.supplierData.page.number && nextPage < this.supplierData.page.totalPages) {
        this._spinnerService.show();

        this._getSuppliers(nextPage).subscribe(
          (suppliers) => {
            this.supplierData = suppliers;
            this.suppliers.push(...this.supplierData._embedded.suppliers);
            this._spinnerService.hide();
          },
          (err) => {
            this._spinnerService.hide();
            this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
          },
        );
      }
    }
  }

  private _initForm() {
    this._activatedRoute.queryParams
      .pipe(
        switchMap((queryParams) => {
          this._spinnerService.show();
          this.query = queryParams.q;
          this.page = queryParams.page ? +queryParams.page : 0;

          if (this.page) {
            this.pos = +queryParams.pos;

            return forkJoin(Array.from(Array(this.page).keys()).map((n) => this._getSuppliers(n)))
              .pipe(
                switchMap((suppliers) => {
                  suppliers.forEach((model) => {
                    this.suppliers.push(...model._embedded.suppliers);
                  })
                  return this._getSuppliers(this.page);
                })
              )
          }
          return this._getSuppliers(this.page);
        }),
      )
      .subscribe(
        (suppliers) => {
          this.supplierData = suppliers;

          if (this.supplierData.page.number === 0) {
            this.suppliers = this.supplierData._embedded.suppliers;
          } else {
            this.suppliers.push(...this.supplierData._embedded.suppliers);
          }
          this._spinnerService.hide();
        },
        (err) => {
          this._spinnerService.hide();
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );
  }

  private _getSuppliers(page: number) {
    if (this.query?.length) {
      return this._supplierService.findSuppliersBy(this.query, page, PAGE_SIZE);
    }
    return this._supplierService.getAllSuppliers(page, PAGE_SIZE);
  }

  private _changeQueryParamsPagePosInUrl(page: number, pos: number) {
    let url;
    if (page) {
      if (this._activatedRoute.snapshot.queryParamMap.get('page')) {
        const params = new Map([['page', page], ['pos', pos]]);
        url = updateUrlParameters(this._router.url, params);
      } else {
        url = removeURLParameters(this._router.url, 'pos');
        const params = new Map([['page', page], ['pos', pos]]);
        url = addURLParameters(url, params);
      }
    } else if (!page && pos > 3) {
      if (this._activatedRoute.snapshot.queryParamMap.get('pos')) {
        const params = new Map([['pos', pos]]);
        url = removeURLParameters(this._router.url, 'page');
        url = updateUrlParameters(url, params);
      } else {
        const params = new Map([['pos', pos]]);
        url = addURLParameters(this._router.url, params);
      }
    } else {
      url = removeURLParameters(this._router.url, 'page', 'pos');
    }
    this._location.go(url);
  }

  private async _scrollToIndex(index: number, logout: number) {
    if (logout < 0) {
      return;
    }

    if (this.virtualScroller) {
      this.virtualScroller.scrollToIndex(index);
      return;
    }

    await this._sleep(10).then(() => this._scrollToIndex(index, --logout));
  }

  private _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
