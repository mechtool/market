import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { UserOrganizationModel } from '#shared/modules/common-services/models/user-organization.model';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-active-organizations',
  templateUrl: './active-organizations.component.html',
  styleUrls: [
    './active-organizations.component.scss',
    './active-organizations.component-992.scss',
    './active-organizations.component-768.scss',
  ],
})
export class ActiveOrganizationsComponent {
  @Input() organizations: UserOrganizationModel[];
  @Output() getAccessKeyRequestChange: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  emitRequestAccessKey(org) {
    this.getAccessKeyRequestChange.emit(org);
  }

}
