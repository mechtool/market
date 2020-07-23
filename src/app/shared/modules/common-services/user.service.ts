import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthResponseModel, CategoryModel, CategoryResponseModel, UserOrganizationModel } from './models';
import { OrganizationsService } from './organizations.service';
import { convertListToTree } from '#shared/utils';
import { BNetService } from './bnet.service';

@Injectable()
export class UserService {
  userOrganizations$: BehaviorSubject<UserOrganizationModel[]> = new BehaviorSubject(null);
  userCategories$: BehaviorSubject<CategoryModel[]> = new BehaviorSubject(null);
  userData$: BehaviorSubject<AuthResponseModel> = new BehaviorSubject(null);

  constructor(
    private _organizationsService: OrganizationsService,
    private _bnetService: BNetService,
  ) {
  }

  setUserData(data: any): void {
    this.userData$.next(data);
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

  updateUserCategories(): Observable<boolean> {
    return this._bnetService.getCategories().pipe(
      catchError((err) => {
        console.error('error', err);
        return throwError(false);
      }),
      map((res: CategoryResponseModel) => {
        const tree = convertListToTree(res.categories);
        this.userCategories$.next(tree);
        return true;
      })
    );
  }
}

