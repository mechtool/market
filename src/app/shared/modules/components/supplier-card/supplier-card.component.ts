import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SupplierInfoModel } from '#shared/modules/common-services/models/supplier-info.model';
import { Router } from '@angular/router';
import { randomARGB } from '#shared/utils/get-color';


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

  @Input() supplier: SupplierInfoModel;

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
