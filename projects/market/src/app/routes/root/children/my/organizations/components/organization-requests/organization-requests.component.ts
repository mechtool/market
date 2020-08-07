import { Input, Output, Component, EventEmitter } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { stringToHex } from '#shared/utils';
import { ParticipationRequestResponseModel } from '#shared/modules/common-services/models/participation-request-response.model';

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

  setHexColor(str: string): string {
    return stringToHex(str);
  }

  emitMakeRequestDecisionRequestChange(requestId: string) {
    this.makeRequestDecisionRequestChange.emit(requestId);
  }

}
