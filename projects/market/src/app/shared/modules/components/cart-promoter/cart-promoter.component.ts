import { Component, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-auth-decision-maker',
  templateUrl: './cart-promoter.component.html',
  styleUrls: [
    './cart-promoter.component.scss',
    './cart-promoter.component-400.scss',
  ],
})
export class CartPromoterComponent {
  @Output() destroyModalChange: Subject<any> = new Subject();

  constructor(private _router: Router) {
  }

  close(): void {
    this._destroy();
  }

  goToCart(): void {
    this._destroy();
    this._router.navigate(['/cart']);
  }

  private _destroy() {
    this.destroyModalChange.next(true);
  }
}
