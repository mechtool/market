import { UntilDestroy } from '@ngneat/until-destroy';
import { Component, Input, OnInit } from '@angular/core';
import { CommerceMlDocumentResponseModel, EdiService, NotificationsService } from '#shared/modules/common-services';
import { resizeBusinessStructure } from '#shared/utils';

enum DocumentType { ORDER = 'ORDER', ACCOUNT = 'ACCOUNT'}

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-payment-document',
  templateUrl: './payment-document.component.html',
  styleUrls: [
    './payment-document.component.scss',
  ]
})
export class PaymentDocumentComponent implements OnInit {
  @Input() documentId: number;
  @Input() documentType: DocumentType;
  document: CommerceMlDocumentResponseModel;
  isError: boolean;

  constructor(
    private _ediService: EdiService,
    private _notificationsService: NotificationsService,
  ) {
  }

  get outcomeVat(): number {
    /*
    const outcome = this.document?.outcome.find(res => res.key === 'СуммаНалогаИтог');
    return outcome && isNumeric(outcome.value) ? +outcome.value : null;
    Пока небезопасно использовать данные из commerceml так как не всегда приходят эти данные,
    похоже что коробка и сервис корзины по-разннному формируют эти данные
    В докумете типа v8.СчетНаОплату вообще отсутствует информация по итоговому НДС.
    Поэтому пока делаем расчет тут.
    */

    let totalVat = 0;
    this.document.products.forEach((doc) => {
      totalVat += doc.tax?.vatSum;
    });

    return totalVat;
  }

  ngOnInit(): void {
    if (this.documentType === DocumentType.ORDER) {
      this._ediService.getOrderDocument(this.documentId)
        .subscribe((document) => {
          this.document = document;
        }, (err) => {
          this.isError = true;
          this._notificationsService.error('Невозможно отобразить заказ. Внутренняя ошибка сервера.');
        });
    } else if (this.documentType === DocumentType.ACCOUNT) {
      this._ediService.getAccountDocument(this.documentId)
        .subscribe((document) => {
          this.document = document;
        }, (err) => {
          this.isError = true;
          this._notificationsService.error('Невозможно отобразить счет. Внутренняя ошибка сервера.');
        });
    }
  }

  name(name: string): string {
    return resizeBusinessStructure(name);
  }

  kpp(kpp: string): string {
    return kpp ? `, КПП ${kpp}` : '';
  }
}
