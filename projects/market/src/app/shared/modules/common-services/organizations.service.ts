import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  AccessKeyModel,
  AccessKeyResponseModel,
  CounterpartyResponseModel,
  OrganizationAdminResponseModel,
  OrganizationResponseModel,
  OrganizationUserResponseModel,
  ParticipationRequestRequestModel,
  ParticipationRequestResponseModel,
  RegisterOrganizationRequestModel,
  UpdateOrganizationContactPersonRequestModel,
  UpdateOrganizationRequestModel,
  UserOrganizationModel
} from './models';
import { BNetService } from './bnet.service';
import { map } from 'rxjs/operators';

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

  getOrganizationProfile(id: string): Observable<OrganizationResponseModel> {
    return this._bnetService.getOrganizationProfile(id);
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

  getOwnParticipationRequests(): Observable<ParticipationRequestResponseModel[]> {
    return this._bnetService.getOwnParticipationRequests();
  }

  getParticipationRequests(
    query: ParticipationRequestRequestModel = { page: 0, size: 100 }
  ): Observable<ParticipationRequestResponseModel[]> {
    // TODO: ограничение в 100 элементов убрать в дальнейшем
    return this._bnetService.getParticipationRequests(query)
      .pipe(
        map((res) => {
          return res.filter((req) => !req.requestStatus?.resolutionDate);
        })
      );
  }

  acceptParticipationRequestById(id: string): Observable<any> {
    return this._bnetService.acceptParticipationRequestById(id);
  }

  rejectParticipationRequestById(id: string): Observable<any> {
    return this._bnetService.rejectParticipationRequestById(id);
  }

  obtainAccessKey(orgId: string): Observable<AccessKeyModel> {
    return this._bnetService.obtainAccessKey(orgId);
  }

  getAccessKeysByOrganizationId(orgId: string): Observable<AccessKeyResponseModel[]> {
    return this._bnetService.getAccessKeys().pipe(
      map((res) => {
        return res.filter((key) => key.organization?.id === orgId).sort((a, b) => a.creationDate > b.creationDate ? -1 : 1);
      })
    );
  }

  registerOrganization(data: RegisterOrganizationRequestModel): Observable<any> {
    return this._bnetService.registerOrganization(data);
  }

  updateOrganization(id: string, data: UpdateOrganizationRequestModel): Observable<any> {
    return this._bnetService.updateOrganization(id, data);
  }

  updateOrganizationContact(id: string, data: UpdateOrganizationContactPersonRequestModel): Observable<any> {
    return this._bnetService.updateOrganizationContact(id, data);
  }

  deleteUserFromOrganization(id: string, userId: string): Observable<any> {
    return this._bnetService.deleteUserFromOrganization(id, userId);
  }

  deleteAccessKey(accessKeyId: string): Observable<any> {
    return this._bnetService.deleteAccessKey(accessKeyId);
  }

  acceptParticipationRequest(requestId: string): Observable<any> {
    return this._bnetService.acceptParticipationRequest(requestId);
  }

  rejectParticipationRequest(requestId: string): Observable<any> {
    return this._bnetService.rejectParticipationRequest(requestId);
  }

  getOrganizationUsers(id: string): Observable<OrganizationUserResponseModel[]> {
    return this._bnetService.getOrganizationUsers(id);
  }

  findCounterpartyDataByInn(inn: string): Observable<CounterpartyResponseModel> {
    return this._bnetService.findCounterpartyDataByInn(inn);
  }

  findCounterpartiesDataByInns(inns: string[]): Observable<CounterpartyResponseModel[]> {
    return this._bnetService.findCounterpartiesDataByInns(inns);
  }

}
