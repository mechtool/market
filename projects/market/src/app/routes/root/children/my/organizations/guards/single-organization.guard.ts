import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { UserService } from '#shared/modules/common-services';

@Injectable()
export class SingleOrganizationGuard implements CanActivate {
  constructor(
    private _userService: UserService,
    private _router: Router,
  ) {
  }

  canActivate(next: ActivatedRouteSnapshot): any {
    const userOrganizationsIds = this._userService.organizations$.value.map(org => org.organizationId) || [];

    if (userOrganizationsIds.includes(next.params.id)) {
      return true;
    }
    if (!userOrganizationsIds.includes(next.params.id)) {
      this._router.navigateByUrl(`my/organizations?tab=a`);
    }
  }
}

