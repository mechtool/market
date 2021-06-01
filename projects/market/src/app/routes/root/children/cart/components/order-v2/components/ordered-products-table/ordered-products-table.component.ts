import { AfterViewInit, Component } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { OrderV2Service } from '../../order-v2.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationsService, TradeOffersService } from '#shared/modules';
import { Router } from '@angular/router';

@Component({
  selector: 'market-ordered-products-table',
  templateUrl: './ordered-products-table.component.html',
  styleUrls: [
    './ordered-products-table.component.scss',
    './ordered-products-table.component-1380.scss',
    './ordered-products-table.component-768.scss',
    './ordered-products-table.component-576.scss',
    './ordered-products-table.component-360.scss',
  ],
})
export class OrderedProductsTableComponent implements AfterViewInit {

  get isOrderLoading() {
    return this._orderV2Service.isOrderLoading;
  }

  get isOrderType(): boolean {
    return this._orderV2Service.isOrderType;
  }

  get unavailableToOrder(): boolean {
    return this._orderV2Service.unavailableToOrder;
  }

  get minOrderAmountViolations(): any {
    return this._orderV2Service.minOrderAmountViolations;
  }

  get form(): FormGroup {
    return this._orderV2Service.form;
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  get itemsControls(): FormGroup[] {
    return this.items.controls as FormGroup[];
  }

  constructor(
    private _router: Router,
    private _orderV2Service: OrderV2Service,
    private _tradeOffersService: TradeOffersService,
    private _notificationsService: NotificationsService,
  ) {
  }

  ngAfterViewInit(): void {
    dispatchEvent(new CustomEvent('scroll'));
  }

  goToTradeOffer(tradeOfferId: string) {
    if (tradeOfferId) {
      this._tradeOffersService.get(tradeOfferId).subscribe(
        (tradeOffer) => {
          const supplierId = tradeOffer.supplier?.bnetInternalId;
          this._router.navigate([`./supplier/${supplierId}/offer/${tradeOfferId}`]);
        },
        (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this._notificationsService.error('Данный товар недоступен к просмотру');
          } else {
            this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
          }
        },
      );
    }
  }

  removeItem(item: any) {
    this._orderV2Service.removeItem(item)
  }
}
