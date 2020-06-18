import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { randomARGB } from '#shared/utils/get-color';
import { SuppliersItemModel } from '#shared/modules';

@UntilDestroy({ checkProperties: true })
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
export class SupplierCardComponent {

  @Input() supplier: SuppliersItemModel;

  constructor(private _router: Router) {
  }

  clickSupplier() {
    this._router.navigate([`./supplier/${this.supplier.id}`]);
  }

  get argb() {
    return randomARGB();
  }
}
