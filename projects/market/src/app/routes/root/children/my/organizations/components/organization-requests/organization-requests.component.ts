import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ParticipationRequestResponseModel } from '#shared/modules/common-services/models';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-organization-requests',
  templateUrl: './organization-requests.component.html',
  styleUrls: [
    './organization-requests.component.scss',
    './organization-requests.component-992.scss',
    './organization-requests.component-768.scss',
  ],
})
export class OrganizationRequestsComponent {
  @Input() requests: ParticipationRequestResponseModel[];
  @Output() makeRequestDecisionRequestChange: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  emitMakeRequestDecisionRequestChange(requestId: string) {
    this.makeRequestDecisionRequestChange.emit(requestId);
  }

}
