import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { SuppliersItemModel } from '#shared/modules';
import { resizeBusinessStructure } from '#shared/utils';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'my-about-supplier',
  templateUrl: './about-supplier.component.html',
  styleUrls: [
    './about-supplier.component.scss',
    './about-supplier.component-576.scss',
    './about-supplier.component-400.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AboutSupplierComponent {

  @Input() supplier: SuppliersItemModel;
  @Input() supplierLogo: string;
  @Input() showStoreButton: boolean;

  get name() {
    return resizeBusinessStructure(this.supplier.name);
  }

  constructor() {
  }

}
