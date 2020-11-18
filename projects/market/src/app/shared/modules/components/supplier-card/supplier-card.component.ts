import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { SuppliersItemModel } from '#shared/modules/common-services/models';

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

}
