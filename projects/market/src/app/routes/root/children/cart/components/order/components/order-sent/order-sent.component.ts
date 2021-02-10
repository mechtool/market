import { Component, Input, OnInit, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-order-sent',
  templateUrl: './order-sent.component.html',
  styleUrls: ['./order-sent.component.scss'],
})
export class OrderSentComponent implements OnInit {
  @Input() isOrderType: boolean;
  @Output() destroyModalChange: Subject<any> = new Subject();
  title: string;
  description: string;

  constructor(private _router: Router) {
  }

  ngOnInit(): void {
    this.title = `${this.isOrderType ? 'Заказ' : 'Запрос цен'} отправлен поставщику`;
    this.description = `Отследить статус ${this.isOrderType ? 'заказа' : 'запроса цен'} вы можете в разделе «Мои заказы».`;
  }

  goToMyOrders(): void {
    this.destroyModalChange.next(true);
    this._router.navigateByUrl('/my/orders');
  }
}
