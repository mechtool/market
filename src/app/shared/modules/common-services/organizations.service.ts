import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { UserOrganizationModel } from './models';
import { BNetService } from './bnet.service';

@Injectable()
export class OrganizationsService {

  constructor(private _bnetService: BNetService) {}

  getUserOrganizations(): Observable<UserOrganizationModel[]> {
    return this._bnetService.getUserOrganizations();
  }


}
