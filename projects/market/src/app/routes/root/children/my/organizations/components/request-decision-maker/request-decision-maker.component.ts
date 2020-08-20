import { Component, Input, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ParticipationRequestResponseModel } from '#shared/modules/common-services/models/participation-request-response.model';
import { Subject } from 'rxjs';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-request-decision-maker',
  templateUrl: './request-decision-maker.component.html',
  styleUrls: ['./request-decision-maker.component.scss'],
})
export class RequestDecisionMakerComponent {
  @Input() request: ParticipationRequestResponseModel;
  @Output() makeDecisionChange: Subject<any> = new Subject();

  constructor() {}

  accept(requestId: string) {
    this.makeDecisionChange.next([requestId, true]);
  }

  reject(requestId: string) {
    this.makeDecisionChange.next([requestId, false]);
  }

}

