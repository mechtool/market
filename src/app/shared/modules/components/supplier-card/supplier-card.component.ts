import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { randomARGB } from '#shared/utils/get-color';
import { SuppliersItemModel } from '#shared/modules';


@Component({
  selector: 'my-supplier-card',
  templateUrl: './supplier-card.component.html',
  styleUrls: [
    './supplier-card.component.scss',
    './supplier-card.component-576.scss',
    './supplier-card.component-400.scss',
    './supplier-card.component-340.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierCardComponent implements OnInit, OnDestroy {

  @Input() supplier: SuppliersItemModel;

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
    return randomARGB();
  }
}
