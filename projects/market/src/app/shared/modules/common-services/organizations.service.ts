import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { OrganizationResponseModel, UserOrganizationModel } from './models';
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
}
