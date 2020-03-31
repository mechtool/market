import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { UserOrganizationModel, AuthResponseModel } from './models';
import { OrganizationsService } from './organizations.service';

@Injectable()
export class UserService {

  userOrganizations$: BehaviorSubject<UserOrganizationModel[]> = new BehaviorSubject(null);
  userData$: BehaviorSubject<AuthResponseModel> = new BehaviorSubject(null);

  constructor(private _organizationsService: OrganizationsService) {}

  setUserData(data: any, fromNextTick = true): void {
    if (fromNextTick) {
      setTimeout(() => {
        this.userData$.next(data);
      }, 0);
    }
    if (!fromNextTick) {
      this.userData$.next(data);
    }
  }

  // TODO: может позже рефакторнуть - убрать логику лишнюю
  updateUserOrganizations(fromNextTick = true): void {
    this._organizationsService.getUserOrganizations().subscribe((res) => {
      if (fromNextTick) {
        setTimeout(() => {
          this.userOrganizations$.next(res);
        }, 0);
      }
      if (!fromNextTick) {
        this.userOrganizations$.next(res);
      }
    });
  }


}

