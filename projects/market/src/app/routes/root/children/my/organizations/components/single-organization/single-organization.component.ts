import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Router, ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OrganizationsService, NotificationsService, UserService } from '#shared/modules/common-services';
import { OrganizationUserResponseModel, ParticipationRequestResponseModel, UserOrganizationModel, OrganizationResponseModel, AccessKeyResponseModel } from '#shared/modules/common-services/models';
import { AccessKeyComponent } from '../access-key/access-key.component';

type TabType = 'a'|'b'|'c'|'d'|'e';

@UntilDestroy({ checkProperties: true })
@Component({
  templateUrl: './single-organization.component.html',
  styleUrls: [
    './single-organization.component.scss',
    './single-organization.component-768.scss',
    './single-organization.component-576.scss',
  ],
})
export class SingleOrganizationComponent implements OnInit {
  organizationData: OrganizationResponseModel;
  users: OrganizationUserResponseModel[];
  participationRequests: ParticipationRequestResponseModel[];
  accessKeys: AccessKeyResponseModel[];
  activeTabType: TabType;

  constructor(
    private _modalService: NzModalService,
    private _viewContainerRef: ViewContainerRef,
    private _organizationsService: OrganizationsService,
    private _notificationsService: NotificationsService,
    private _userService: UserService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
  ) {
  }

  ngOnInit() {
    this._watchParamsChanges();
    // setTimeout(() => {
    //   this._router.navigateByUrl('my/organizations/bfe77f70-8139-4aec-967c-fa9896e46913');
    // }, 1e4)
  }

  init(orgId: string) {
    console.log(`INIT: ${orgId}`);
    this._setActiveTab();
    this._setOrganizationData(orgId);
    this._setUsers();
    this._setParticipationRequests();
    this._setAccessKeys();
  }

  private _watchParamsChanges() {
    this._activatedRoute.params
      .subscribe(
        (res) => {
          this.init(res.id);
        },
        (err) => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        });
  }

  private _setActiveTab() {
    this.activeTabType = 'a';
  }

  private _setOrganizationData(orgId: string) {
    this._organizationsService.getOrganization(orgId).subscribe((res) => {
      this.organizationData = res;
    })
  }

  private _setUsers() {
    this.users = [];
  }

  private _setParticipationRequests() {
    this.participationRequests = [];
  }

  private _setAccessKeys() {
    this.accessKeys = [];
  }

  createAccessKeyModal() {

    this._organizationsService.obtainAccessKey(this.organizationData.id)
      .subscribe((res) => {
        const modal = this._modalService.create({
          nzContent: AccessKeyComponent,
          nzViewContainerRef: this._viewContainerRef,
          nzGetContainer: () => document.body,
          nzComponentParams: {
            organizationName: this.organizationData.name || null,
            inn: this.organizationData.legalRequisites?.inn || null,
            kpp: this.organizationData.legalRequisites?.kpp || null,
            accessKey: res,
          },
          nzFooter: null,
          nzWidth: 480,
        });

      }, (err) => {
        this._notificationsService.error('Произошла ошибка при получении ключа доступа');
      });
  }


}
