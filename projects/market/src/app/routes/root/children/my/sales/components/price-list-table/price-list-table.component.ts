import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PriceListResponseModel, PriceListStatusEnum } from '#shared/modules/common-services/models';
import { PriceListViewFormComponent } from '../price-list-view-form/price-list-view-form.component';
import { NotificationsService, PriceListsService } from '#shared/modules/common-services';
import { switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'market-price-list-table',
  templateUrl: './price-list-table.component.html',
  styleUrls: [
    './price-list-table.component.scss',
    './price-list-table.component-768.scss',
    './price-list-table.component-340.scss'
  ],
})
export class PriceListTableComponent {
  @Input() priceLists: PriceListResponseModel[] = [];
  @Output() startFeedChange: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private _modalService: NzModalService,
    private _priceListsService: PriceListsService,
    private _notificationsService: NotificationsService,
  ) {
  }

  startFeed(priceList: PriceListResponseModel) {
    this._priceListsService.getPriceListFeed(priceList.externalCode)
      .pipe(
        switchMap((feed) => {
          if (feed.lastCompletionStatus === PriceListStatusEnum.InProgress) {
            this.priceLists?.forEach((pl) => {
              if (pl.id === priceList.id) {
                pl.feedInfo.lastCompletionStatus = PriceListStatusEnum.InProgress;
              }
            });
            return throwError(new Error('Прайс-лист поставлен в очередь на обновление торговых предложений.'));
          }
          return this._priceListsService.startFeed(priceList.externalCode);
        }),
      )
      .subscribe(() => {
        this.startFeedChange.emit(true);
        this._notificationsService.info(`Прайс-лист поставлен в очередь на обновление торговых предложений.`)
      }, (err) => {
        if (err.message.includes('обновление')) {
          this.startFeedChange.emit(true);
          this._notificationsService.info(err.message);
        } else {
          this._notificationsService.error(err);
        }
      });
  }

  delete(priceList: PriceListResponseModel) {
    this._priceListsService.getPriceListFeed(priceList.externalCode)
      .pipe(
        switchMap((feed) => {
          if (feed.lastCompletionStatus === PriceListStatusEnum.InProgress) {
            this.priceLists?.forEach((pl) => {
              if (pl.id === priceList.id) {
                pl.feedInfo.lastCompletionStatus = PriceListStatusEnum.InProgress;
              }
            });
            return throwError(new Error('Ранее был запущен автоматический процесс обновления торговых предложений. Удаление прайс-листа невозможно, попробуйте позже.'));
          }
          return this._priceListsService.deletePriceListFeed(priceList.externalCode);
        }),
        switchMap(() => {
          return this._priceListsService.deletePriceList(priceList.id);
        })
      )
      .subscribe(() => {
        this.priceLists?.splice(this.priceLists.findIndex(pl => pl.id === priceList.id), 1)
        this._notificationsService.info(`Прайс-лист поставлен в очередь на удаление.`);
      }, (err) => {
        if (err.message.includes('обновления')) {
          this._notificationsService.info(err.message);
        } else {
          this._notificationsService.error(err);
        }
      });
  }

  openPriceList(priceList: any) {
    this._modalService.create({
      nzTitle: 'Просмотр прайс-листа',
      nzContent: PriceListViewFormComponent,
      nzFooter: null,
      nzWidth: 750,
      nzComponentParams: {
        priceList: priceList,
      }
    });
  }
}
