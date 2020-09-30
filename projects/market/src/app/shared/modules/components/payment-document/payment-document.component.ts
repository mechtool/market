import { UntilDestroy } from '@ngneat/until-destroy';
import { Component, Input, OnInit } from '@angular/core';
import {
  CommerceMlDocumentResponseModel,
  EdiService,
  NotificationsService,
  Outcome,
  Product
} from '#shared/modules/common-services';
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
  outcomeVat: number;
  sumLetters: string;
  isError: boolean;

  constructor(
    private _ediService: EdiService,
    private _notificationsService: NotificationsService,
  ) {
  }

  ngOnInit(): void {
    if (this.documentType === DocumentType.ORDER) {
      this._ediService.getOrderDocument(this.documentId)
        .subscribe((document) => {
          this.fillDate(document);
        }, (err) => {
          this.isError = true;
          this._notificationsService.error('Невозможно отобразить заказ. Внутренняя ошибка сервера.');
        });
    } else if (this.documentType === DocumentType.ACCOUNT) {
      this._ediService.getAccountDocument(this.documentId)
        .subscribe((document) => {
          this.fillDate(document);
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

  private fillDate(document: CommerceMlDocumentResponseModel) {
    this.document = document;
    this.sumLetters = this.mapSumLetters(document.outcome);
    this.outcomeVat = this.mapOutcomeVat(document.products);
  }

  private mapOutcomeVat(products: Product[]): number {
    /*
    const outcome = this.document?.outcome.find(res => res.key === 'СуммаНалогаИтог');
    return outcome && isNumeric(outcome.value) ? +outcome.value : null;
    Пока небезопасно использовать данные из commerceml так как не всегда приходят эти данные,
    похоже что коробка и сервис корзины по-разннному формируют эти данные
    В докумете типа v8.СчетНаОплату вообще отсутствует информация по итоговому НДС.
    Поэтому пока делаем расчет тут.
    */

    let totalVat = 0;
    products.forEach((doc) => {
      totalVat += doc.tax?.vatSum;
    });

    return totalVat;
  }

  private mapSumLetters(outcome: Outcome[]) {
    return outcome.find((res) => res.key === 'ИтогиПрописью')?.value;
  }
}
