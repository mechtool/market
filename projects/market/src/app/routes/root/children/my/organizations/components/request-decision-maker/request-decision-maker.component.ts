import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ParticipationRequestResponseModel } from '#shared/modules/common-services/models/participation-request-response.model';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-request-decision-maker',
  templateUrl: './request-decision-maker.component.html',
  styleUrls: ['./request-decision-maker.component.scss'],
})
export class RequestDecisionMakerComponent {
  @Input() request: ParticipationRequestResponseModel;
  @Output() makeDecisionChange: EventEmitter<any> = new EventEmitter();

  constructor() {}

  accept(requestId: string) {
    this.makeDecisionChange.emit([requestId, true]);
  }

  reject(requestId: string) {
    this.makeDecisionChange.emit([requestId, false]);
  }

}

