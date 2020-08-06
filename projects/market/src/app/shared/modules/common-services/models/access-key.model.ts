import { OrganizationResponseModel } from './organization-response.model';

export class ParticipationRequestResponseModel {
  requestId: string;
  requesterNotes: string;
  requestDate: string;
  requestStatus: ParticipationRequestStatusResponseModel;
  organization: OrganizationResponseModel;
}

export class ParticipationRequestStatusResponseModel {
  resolutionStatus: string;
  resolutionDate: any;
  resolutionNotes: string;
}
