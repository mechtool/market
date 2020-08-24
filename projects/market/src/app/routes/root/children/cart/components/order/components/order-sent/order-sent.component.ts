import { Component, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-order-sent',
  templateUrl: './order-sent.component.html',
  styleUrls: ['./order-sent.component.scss'],
})
export class OrderSentComponent {
  @Output() destroyModalChange: Subject<any> = new Subject();

  constructor(private _router: Router) {}

  goToMyOrders(): void {
    this._destroy();
    this._router.navigateByUrl('/my/orders');
  }

  private _destroy() {
    this.destroyModalChange.next(true);
  }

}
