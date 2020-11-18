import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { AccessKeyResponseModel } from '#shared/modules/common-services/models/access-key-response.model';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-organization-access-keys',
  templateUrl: './organization-access-keys.component.html',
  styleUrls: [
    './organization-access-keys.component.scss',
    './organization-access-keys.component-992.scss',
    './organization-access-keys.component-768.scss',
  ],
})
export class OrganizationAccessKeysComponent {
  @Input() accessKeys: AccessKeyResponseModel[];
  @Output() removeAccessKeyRequestChange: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  emitRemoveAccessKeyRequestChange(accessKeyId: string) {
    this.removeAccessKeyRequestChange.emit(accessKeyId);
  }

}
