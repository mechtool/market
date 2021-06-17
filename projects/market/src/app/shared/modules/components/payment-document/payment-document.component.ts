import { UntilDestroy } from '@ngneat/until-destroy';
import { Component, Input, OnInit } from '@angular/core';
import {
  CommerceMlDocumentResponseModel,
  EdiService,
  NotificationsService,
  Outcome,
  Product
} from '#shared/modules/common-services';
import { defer, Observable } from 'rxjs';

enum DocumentType {
  ORDER = 'ORDER',
  ACCOUNT = 'ACCOUNT',
}

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-payment-document',
  templateUrl: './payment-document.component.html',
  styleUrls: ['./payment-document.component.scss'],
})
export class PaymentDocumentComponent implements OnInit {
  @Input() documentId: number;
  @Input() documentType: DocumentType;
  document: CommerceMlDocumentResponseModel;
  outcomeVat: number;
  sumLetters: string;
  isError: boolean;

  constructor(private _ediService: EdiService, private _notificationsService: NotificationsService) {
  }

  ngOnInit(): void {
    this._getDocumentConditionally$().subscribe(
      (document) => {
        this._fillData(document);
      },
      (err) => {
        this.isError = true;
        this._notificationsService.error(err);
      },
    );
  }

  private _getDocumentConditionally$(): Observable<CommerceMlDocumentResponseModel> {
    return defer(() => {
      return this.documentType === DocumentType.ORDER
        ? this._ediService.getOrderDocument(this.documentId)
        : this._ediService.getAccountDocument(this.documentId);
    });
  }

  private _fillData(document: CommerceMlDocumentResponseModel) {
    this.document = document;
    this.sumLetters = this._mapSumLetters(document.outcome);
    this.outcomeVat = this._mapOutcomeVat(document.products);
  }

  private _mapOutcomeVat(products: Product[]): number {
    /*
    const outcome = this.document?.outcome.find(res => res.key === 'СуммаНалогаИтог');
    return outcome && isNumeric(outcome.value) ? +outcome.value : null;
    Пока небезопасно использовать данные из commerceml так как не всегда приходят эти данные,
    похоже что коробка и сервис корзины по-разннному формируют эти данные
    В докумете типа v8.СчетНаОплату вообще отсутствует информация по итоговому НДС.
    Поэтому пока делаем расчет тут.
    */

    return products.reduce((accum, curr) => {
      accum += curr.tax?.vatSum || 0;
      return accum;
    }, 0);
  }

  private _mapSumLetters(outcome: Outcome[]) {
    return outcome.find((res) => res.key === 'ИтогиПрописью')?.value;
  }
}
