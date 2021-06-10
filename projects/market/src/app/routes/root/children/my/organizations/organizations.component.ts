import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { OrganizationsService } from '#shared/modules/common-services/organizations.service';
import { NotificationsService } from '#shared/modules/common-services/notifications.service';
import { UserService } from '#shared/modules/common-services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserOrganizationModel } from '#shared/modules/common-services/models/user-organization.model';
import { ParticipationRequestResponseModel } from '#shared/modules/common-services/models/participation-request-response.model';
import { ExternalProvidersService } from '#shared/modules/common-services/external-providers.service';
import { MetrikaEventTypeModel } from '#shared/modules/common-services/models';
import { LocalStorageService } from '#shared/modules';
import { AccessKeyComponent } from './components';
import { switchMap, tap } from 'rxjs/operators';

type TabType = 'a' | 'b' | 'c';

@Component({
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss', './organizations.component-768.scss', './organizations.component-576.scss'],
})
export class OrganizationsComponent implements OnInit {
  checkedLegalRequisites = null;
  newSentRequests: number;
  private _activeTabType: TabType;

  get activeTabType(): TabType {
    return this._activeTabType;
  }

  set activeTabType(val: TabType) {
    this._activeTabType = val;
    if (this._activeTabType === 'b') {
      this._setUserParticipationRequests();
    }
  }

  get userOrganizations$(): Observable<UserOrganizationModel[]> {
    return this._userService.organizations$;
  }

  get userOwnParticipationRequests$(): Observable<ParticipationRequestResponseModel[]> {
    return this._userService.ownParticipationRequests$;
  }

  constructor(
    private _externalProvidersService: ExternalProvidersService,
    private _notificationsService: NotificationsService,
    private _organizationsService: OrganizationsService,
    private _localStorageService: LocalStorageService,
    private _viewContainerRef: ViewContainerRef,
    private _activatedRoute: ActivatedRoute,
    private _modalService: NzModalService,
    private _userService: UserService,
    private _router: Router,
  ) {
  }

  ngOnInit() {
    this._setActiveTabType('a');
    this._watchQueryParamsChanges();
    this._setUserParticipationRequests();
  }

  sendParticipationRequest(data: any) {
    const bodyData = {
      organizationId: data.organizationId,
      notes: `Заявка на присоединение к организации ${data.name} от ${data.personName} (${data.personEmail}). ${data.messageForAdmin}`,
    };
    this._organizationsService.sendParticipationRequest(bodyData).subscribe(
      (_) => {
        this.goToTab('b');
      },
      (err) => {
        this._notificationsService.error();
      },
    );
  }

  registerOrganization(data: any) {
    const legalRequisites = {
      inn: data.inn,
      ...(data.kpp && { kpp: data.kpp }),
    };

    const contacts = {
      ...(data.contactsEmail && { email: data.contactsEmail }),
      ...(data.contactsPhone && { phone: data.contactsPhone }),
      ...(data.contactsWebsite && { website: data.contactsWebsite }),
      ...(data.contactsAddress && { address: data.contactsAddress }),
    };

    const contactPerson = {
      email: data.contactPersonEmail,
      fullName: data.contactPersonFullName,
      phone: data.contactPersonPhone,
    };

    const regOrgData = {
      legalRequisites,
      contactPerson,
      name: data.name,
      ...(Object.keys(contacts).length && { contacts }),
      ...(data.description && { description: data.description }),
    };

    this._organizationsService
      .registerOrganization(regOrgData)
      .pipe(
        switchMap((_) => this._organizationsService.getUserOrganizations()),
        tap((res) => this._userService.setUserOrganizations(res)),
        tap(() => this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.ORG_REGISTER)),
      )
      .subscribe(
        () => {
          const tabSplitted = this._activatedRoute.snapshot.queryParams?.tab?.split(';');
          if (tabSplitted.length > 1) {
            this._router.navigateByUrl(tabSplitted[1]);
            return;
          }
          this.checkedLegalRequisites = null;
          this.goToTab('a');
        },
        (err) => {
          this._notificationsService.error();
        },
      );
  }

  goToTab(tabType: TabType) {
    this._router.navigateByUrl(this._router.url.split('?')[0], { skipLocationChange: true }).then(() => {
      this._router.navigateByUrl(`my/organizations?tab=${tabType}`);
    });
  }

  createAccessKeyModal(org: UserOrganizationModel) {
    this._organizationsService.obtainAccessKey(org.organizationId).subscribe(
      (res) => {
        const modal = this._modalService.create({
          nzContent: AccessKeyComponent,
          nzViewContainerRef: this._viewContainerRef,
          nzComponentParams: {
            organizationName: org?.organizationName || null,
            inn: org?.legalRequisites?.inn || null,
            kpp: org?.legalRequisites?.kpp || null,
            accessKey: res,
          },
          nzFooter: null,
          nzWidth: 480,
        });
      },
      (err) => {
        this._notificationsService.error();
      },
    );
  }

  private _watchQueryParamsChanges() {
    this._activatedRoute.queryParams
      .subscribe((res) => {
          const tabValue = res.tab?.split(';')[0];
          switch (tabValue) {
            case 'a':
              this._setActiveTabType('a');
              break;
            case 'b':
              this._setActiveTabType('b');
              break;
            case 'c':
              this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.MODAL_CHECK_INN_SHOW);
              this._setActiveTabType('c');
              break;
            default:
              this._setActiveTabType('a');
              break;
          }
        },
        (err) => {
          this._notificationsService.error();
        },
      );
  }

  private _setActiveTabType(tabType: TabType) {
    this.activeTabType = tabType;
  }

  private _setUserParticipationRequests() {
    this._organizationsService.getOwnParticipationRequests().subscribe(
      (participationRequests) => {
        this._userService.ownParticipationRequests$.next(participationRequests);

        const lastVisit = this._localStorageService.getDateOfLaterVisitMyOrganizations();
        this.newSentRequests = undefined;
        if (lastVisit) {
          participationRequests.forEach((request) => {
            if (new Date(lastVisit) < new Date(request.requestDate)) {
              this.newSentRequests = ++this.newSentRequests || 1;
            }
          });
        }
      },
      (err) => {
        this._notificationsService.error();
      },
    );
  }
}
