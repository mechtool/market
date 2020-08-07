import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  OrganizationResponseModel,
  UserOrganizationModel,
  OrganizationAdminResponseModel,
  AccessKeyResponseModel,
  ParticipationRequestResponseModel,
  RegisterOrganizationRequestModel,
  AccessKeyModel
} from './models';
import { BNetService } from './bnet.service';

@Injectable()
export class OrganizationsService {

  constructor(private _bnetService: BNetService) {
  }

  getUserOrganizations(): Observable<UserOrganizationModel[]> {
    return this._bnetService.getUserOrganizations();
  }

  getOrganization(id: string): Observable<OrganizationResponseModel> {
    return this._bnetService.getOrganization(id);
  }

  getOrganizationAdminsByLegalId(legalId: string): Observable<OrganizationAdminResponseModel[]> {
    return this._bnetService.getOrganizationAdminsByLegalId(legalId);
  }

  getOrganizationByLegalId(legalId: string): Observable<OrganizationResponseModel> {
    return this._bnetService.getOrganizationByLegalId(legalId);
  }

  sendParticipationRequest(data: any) {
    return this._bnetService.sendParticipationRequest(data);
  }

  getParticipationRequests(): Observable<ParticipationRequestResponseModel[]>  {
    return this._bnetService.getParticipationRequests();
  }

  obtainAccessKey(orgId: string): Observable<AccessKeyModel> {
    return this._bnetService.obtainAccessKey(orgId);
  }

  registerOrganization(data: RegisterOrganizationRequestModel): Observable<any> {
    return this._bnetService.registerOrganization(data);
  }
}
