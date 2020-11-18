import { Component, Input } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ParticipationRequestResponseModel } from '#shared/modules/common-services/models/participation-request-response.model';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-sent-requests',
  templateUrl: './sent-requests.component.html',
  styleUrls: [
    './sent-requests.component.scss',
    './sent-requests.component-768.scss',
  ],
})
export class SentRequestsComponent {
  @Input() requests: ParticipationRequestResponseModel[];

  constructor() {
  }
}


