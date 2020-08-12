import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ActivatedRoute } from '@angular/router';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { OrganizationsService, NotificationsService, UserService } from '#shared/modules/common-services';
import { OrganizationUserResponseModel, ParticipationRequestResponseModel, UserOrganizationModel, OrganizationResponseModel, AccessKeyResponseModel } from '#shared/modules/common-services/models';
import { AccessKeyComponent } from '../access-key/access-key.component';
import { switchMap } from 'rxjs/operators';
import { UserRemovalVerifierComponent } from '../user-removal-verifier/user-removal-verifier.component';
import { RequestDecisionMakerComponent } from '../request-decision-maker/request-decision-maker.component';
import { AccessKeyRemovalVerifierComponent } from '../access-key-removal-verifier/access-key-removal-verifier.component';
import { iif } from 'rxjs';

type TabType = 'a'|'b'|'c'|'d';
type UpdateOrganizationType = {
  inn: string;
  kpp: string;
  organizationName: string;
  organizationDescription: string;
  organizationEmail: string;
  organizationPhone: string;
  organizationWebsite: string;
  organizationAddress: string;
  contactFio: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;
}

const ERROR_DEFAULT = 'Невозможно обработать запрос. Внутренняя ошибка сервера.';
const ERROR_GET_ACCESS_KEY = 'Произошла ошибка при получении ключа доступа.';
const ERROR_DELETE_LAST_ADMIN = 'Невозможно удалить последнего администратора организации.';
const ERROR_SAVE_ORG_UPDATES = 'Произошла ошибка при сохранении изменений в организации.';
const ERROR_ACCEPT_USER_TO_ORG = 'Произошла ошибка при добавлении пользователя в организацию.';
const ERROR_REJECT_USER_TO_ORG = 'Произошла ошибка при отказе от добавления пользователя в организацию.';
const ERROR_REMOVE_USER_FROM_ORG = 'Произошла ошибка при удалении пользователя.';
const ERROR_DELETE_ACCESS_KEY = 'Произошла ошибка при удалении одноразового пароля.';
const ERROR_GET_ORG_INFO = 'Произошла ошибка при получении информации по организации.';
const ERROR_GET_ORG_USERS = 'Произошла ошибка при получении пользователей организации.';
const ERROR_GET_ORG_REQUESTS = 'Произошла ошибка при получении запросов на добавление в организацию.';
const ERROR_GET_ORG_ACCESS_KEYS = 'Произошла ошибка при получении списка одноразовых паролей.';


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
  private _modal: NzModalRef;
  activeTabType: TabType;
  organizationData: OrganizationResponseModel;
  users: OrganizationUserResponseModel[];
  participationRequests: ParticipationRequestResponseModel[];
  accessKeys: AccessKeyResponseModel[];
  legalRequisites: { inn: string; kpp?: string; };
  isEditable: boolean;
  isAdmin: boolean;
  currentUserId: string;

  get orgId(): string {
    return this.organizationData?.id;
  }

  constructor(
    private _modalService: NzModalService,
    private _viewContainerRef: ViewContainerRef,
    private _organizationsService: OrganizationsService,
    private _notificationsService: NotificationsService,
    private _userService: UserService,
    private _activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this._watchParamsChanges();
  }

  init(orgId: string) {
    this._resetActiveTab();
    this._resetIsAdmin(orgId);
    this._resetOrganizationData(orgId);
    if (this.isAdmin) {
      this._resetUsers(orgId);
      this._resetParticipationRequests(orgId);
      this._resetAccessKeys(orgId);
      this._resetIsEditable();
    }
  }

  createAccessKeyComponentModal(): void {
    this._organizationsService.obtainAccessKey(this.orgId)
      .subscribe((res) => {
        this._resetAccessKeys(this.orgId);
        this._modal = this._modalService.create({
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
        this._notificationsService.error(ERROR_GET_ACCESS_KEY);
      });
  }

  createRemoveUserModal(userId: string): void {
    const foundUser = this.users.find((res) => {
      return res.uin === userId;
    });
    if (foundUser && foundUser.userGrants.isAdmin && this.users.filter(r => r.userGrants.isAdmin).length <= 1) {
      this._notificationsService.error(ERROR_DELETE_LAST_ADMIN);
      return;
    }
    this._modal = this._modalService.create({
      nzContent: UserRemovalVerifierComponent,
      nzViewContainerRef: this._viewContainerRef,
      nzGetContainer: () => document.body,
      nzComponentParams: {
        userId,
        personName: foundUser?.person?.personName,
      },
      nzFooter: null,
      nzWidth: 480,
    });
    this._modal.componentInstance.userRemovalChange.subscribe((userId) => {
      this._deleteUserFromOrganization(userId);
    });
    this._modal.componentInstance.destroyModalChange.subscribe(() => {
      this._modal.destroy();
    });
  }

  createRemoveAccessKeyModal(accessKeyId: string): void {
    this._modal = this._modalService.create({
      nzContent: AccessKeyRemovalVerifierComponent,
      nzViewContainerRef: this._viewContainerRef,
      nzGetContainer: () => document.body,
      nzComponentParams: {
        accessKeyId,
      },
      nzFooter: null,
      nzWidth: 480,
    });
    this._modal.componentInstance.accessKeyRemovalChange.subscribe((accessKeyId) => {
      this._deleteAccessKey(accessKeyId);
    });
    this._modal.componentInstance.destroyModalChange.subscribe((res) => {
      this._modal.destroy();
    });
  }

  createMakeRequestDecisionModal(requestId: string): void {
    const request = this.participationRequests.find(req => req.requestId === requestId )
    this._modal = this._modalService.create({
      nzContent: RequestDecisionMakerComponent,
      nzViewContainerRef: this._viewContainerRef,
      nzGetContainer: () => document.body,
      nzComponentParams: {
        request
      },
      nzFooter: null,
      nzWidth: 480,
    });
    this._modal.componentInstance.makeDecisionChange.subscribe(([requestId, type]) => {
      if (type) {
        this._acceptParticipationRequest(requestId);
        this._resetUsers(this.orgId);
        this._resetActiveTab('b');
      }
      if (!type) {
        this._rejectParticipationRequest(requestId);
      }
    });
  }

  updateOrganization(data: UpdateOrganizationType): void {

    const contactPerson = {
      fullName: data.contactFio,
      position: data.contactRole,
      email: data.contactEmail,
      phone: data.contactPhone,
    };

    const contacts = {
      email: data.organizationEmail,
      phone: data.organizationPhone,
      website: data.organizationWebsite,
      address: data.organizationAddress,
    };

    this._organizationsService.updateOrganization(this.orgId, {
      contacts,
      name: data.organizationName,
      description: data.organizationDescription,
    }).pipe(
      switchMap((res) => {
        return this._organizationsService.updateOrganizationContact(this.orgId, contactPerson)
      })
    )
    .subscribe((_) => {
      this.isEditable = false;
      this._resetOrganizationData(this.orgId);
    }, (err) => {
      this._notificationsService.error(ERROR_SAVE_ORG_UPDATES);
    })
  }

  private _acceptParticipationRequest(requestId: string): void {
    this._organizationsService.acceptParticipationRequest(requestId).subscribe((res) => {
      this._modal.destroy();
      this._resetParticipationRequests(this.orgId);
    }, (err) => {
      this._notificationsService.error(ERROR_ACCEPT_USER_TO_ORG);
    })
  }

  private _rejectParticipationRequest(requestId: string): void {
    this._organizationsService.rejectParticipationRequest(requestId).subscribe((res) => {
      this._modal.destroy();
      this._resetParticipationRequests(this.orgId);
    }, (err) => {
      this._notificationsService.error(ERROR_REJECT_USER_TO_ORG);
    })
  }

  private _deleteUserFromOrganization(userId: string): void {
    this._organizationsService.deleteUserFromOrganization(this.orgId, userId).subscribe((res) => {
      this._modal.destroy();
      this._resetUsers(this.orgId);
    }, (err) => {
      this._notificationsService.error(ERROR_REMOVE_USER_FROM_ORG);
    })
  }

  private _deleteAccessKey(accessKeyId: string): void {
    this._organizationsService.deleteAccessKey(accessKeyId).subscribe((res) => {
      this._modal.destroy();
      this._resetAccessKeys(this.orgId);
    }, (err) => {
      this._notificationsService.error(ERROR_DELETE_ACCESS_KEY);
    })
  }

  private _watchParamsChanges(): void {
    this._activatedRoute.params
      .subscribe(
        (res) => {
          this.init(res.id);
        },
        (err) => {
          this._notificationsService.error(ERROR_DEFAULT);
        });
  }

  private _resetActiveTab(tabType: TabType = 'a'): void {
    this.activeTabType = tabType;
  }

  private _resetIsAdmin(orgId: string): void {
    const orgIndex = this._userService.userOrganizations$.value.findIndex((org) => {
      return org.organizationId == orgId && org.userGrants?.isAdmin;
    });
    this.isAdmin = (orgIndex !== -1);
  }

  private _resetOrganizationData(orgId: string): void {
    iif(() => {
      return this.isAdmin;
    }, this._organizationsService.getOrganizationProfile(orgId), this._organizationsService.getOrganization(orgId))
    .subscribe((res) => {
      this.organizationData = res;
      this.legalRequisites = {
        inn: res.legalRequisites?.inn,
        kpp: res.legalRequisites?.kpp || null
      };
    }, (err) => {
      this._notificationsService.error(ERROR_GET_ORG_INFO);
    })
  }

  //
  private _resetUsers(orgId: string): void {
    this._organizationsService.getOrganizationUsers(orgId).subscribe((res) => {
      this.users = res;
    }, (err) => {
      this._notificationsService.error(ERROR_GET_ORG_USERS);
    })
  }

  private _resetParticipationRequests(orgId: string): void {
    this._organizationsService.getParticipationRequests(orgId).subscribe((res) => {
      this.participationRequests = res.filter(req => !req.requestStatus?.resolutionDate)
    }, (err) => {
      this._notificationsService.error(ERROR_GET_ORG_REQUESTS);
    })
  }

  private _resetAccessKeys(orgId: string): void {
    this._organizationsService.getAccessKeysByOrganizationId(orgId).subscribe((res) => {
      this.accessKeys = res;
    }, (err) => {
      this._notificationsService.error(ERROR_GET_ORG_ACCESS_KEYS);
    })
  }

  private _resetIsEditable(): void {
    this.isEditable = false;
  }


}
