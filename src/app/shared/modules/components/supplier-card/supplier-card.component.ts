import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SupplierModel } from '#shared/modules/common-services/models/supplier.model';
import { Router } from '@angular/router';


@Component({
  selector: 'my-supplier-card',
  templateUrl: './supplier-card.component.html',
  styleUrls: [
    './supplier-card.component.scss',
    './supplier-card.component-576.scss',
    './supplier-card.component-400.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierCardComponent implements OnInit, OnDestroy {

  @Input() supplier: SupplierModel;

  constructor(private _router: Router) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  clickSupplier() {
    this._router.navigate([`./supplier/${this.supplier.id}/product`]);
  }

  get argb() {
    return this.randomARGB();
  }

  private randomARGB() {
    const index = Math.floor(Math.random() * 10000000);
    // tslint:disable-next-line:no-bitwise max-line-length
    let hex = ((index >> 24) & 0xFF).toString(16) + ((index >> 16) & 0xFF).toString(16) + ((index >> 8) & 0xFF).toString(16) + (index & 0xFF).toString(16);
    hex += '000000';
    const number = hex.substring(0, 6);

    return `#${number}`;
  }

}
