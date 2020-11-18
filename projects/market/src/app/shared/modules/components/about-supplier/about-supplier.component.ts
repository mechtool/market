import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { SuppliersItemModel } from '#shared/modules/common-services/models';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-about-supplier',
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
  @Input() showStoreButton: boolean;
}
