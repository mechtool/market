import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { SuppliersItemModel } from '#shared/modules/common-services/models';
import { ExternalProvidersService } from '#shared/modules/common-services';

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
  showPhone = false;
  showEmail = false;

  constructor(private _externalProvidersService: ExternalProvidersService) {
  }

  showPhoneTrue() {
    this.showPhone = true;
    this._externalProvidersService.fireGTMEvent({ event: 'PhoneClick' })
  }

  showEmailTrue() {
    this.showEmail = true;
    this._externalProvidersService.fireGTMEvent({ event: 'EmailClick' })
  }
}
