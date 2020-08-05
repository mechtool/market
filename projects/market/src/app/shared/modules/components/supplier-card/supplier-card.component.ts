import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { SuppliersItemModel } from '#shared/modules';
import { resizeBusinessStructure, stringToRGB } from '#shared/utils';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-supplier-card',
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

  get argb() {
    return stringToRGB(this.supplier?.id);
  }

  get name() {
    return resizeBusinessStructure(this.supplier?.name);
  }

  get description() {
    if (this.supplier?.description?.length > 100) {
      return `${this.supplier?.description.slice(0, 100)}...`;
    }
    return this.supplier?.description;
  }

  constructor(private _router: Router) {
  }

  clickSupplier() {
    this._router.navigate([`./supplier/${this.supplier.id}`]);
  }
}
