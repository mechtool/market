import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { SuppliersItemModel } from '#shared/modules';
import { stringToRGB } from '#shared/utils';

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
    return stringToRGB(this.supplier?.id);
  }
}
