import { Component, Input, OnDestroy } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ParticipationRequestResponseModel } from '#shared/modules/common-services/models';
import { LocalStorageService } from '#shared/modules/common-services';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-sent-requests',
  templateUrl: './sent-requests.component.html',
  styleUrls: [
    './sent-requests.component.scss',
    './sent-requests.component-768.scss',
  ],
})
export class SentRequestsComponent implements OnDestroy {
  @Input() requests: ParticipationRequestResponseModel[];

  constructor(private _localStorageService: LocalStorageService) {
  }

  ngOnDestroy(): void {
    this._localStorageService.putDateOfLaterVisitMyOrganizations(Date.now())
  }

  lastVisitLt(requestDate: string) {
    const laterVisit = this._localStorageService.getDateOfLaterVisitMyOrganizations();
    if (laterVisit) {
      return new Date(laterVisit) < new Date(requestDate);
    }
  }
}


