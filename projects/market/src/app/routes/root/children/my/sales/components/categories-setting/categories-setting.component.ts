import { Component } from '@angular/core';
import { UserOrganizationModel } from '#shared/modules/common-services/models';
import { CategoryService, NotificationsService, UserService } from '#shared/modules/common-services';

@Component({
  selector: 'market-categories-setting',
  templateUrl: './categories-setting.component.html',
  styleUrls: [
    './categories-setting.component.scss',
  ],
})
export class CategoriesSettingComponent {
  organizations: UserOrganizationModel[];

  constructor(
    private _userService: UserService,
    private _categoryService: CategoryService,
    private _notificationsService: NotificationsService,
  ) {
    this._categoryService.upload1CnCategoriesTree()
      .subscribe(() => {
        this.organizations = this._userService.organizations$.getValue();
      });
  }
}

