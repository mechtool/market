import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { OrganizationUserResponseModel } from '#shared/modules/common-services/models/organization-user-response.model';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-organization-users',
  templateUrl: './organization-users.component.html',
  styleUrls: [
    './organization-users.component.scss',
    './organization-users.component-992.scss',
    './organization-users.component-768.scss',
  ],
})
export class OrganizationUsersComponent {
  @Input() users: OrganizationUserResponseModel[];
  @Output() removeUserRequestChange: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  emitRemoveUserRequestChange(userId: string) {
    this.removeUserRequestChange.emit(userId);
  }

}
