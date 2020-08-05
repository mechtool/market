import { Input, Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ParticipationRequestResponseModel } from '#shared/modules/common-services/models/participation-request-response.model';
import { stringToHex } from '#shared/utils';

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

  setHexColor(str: string): string {
    return stringToHex(str);
  }


}


