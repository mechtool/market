import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RequisitesCheckerComponent } from './components/requisites-checker/requisites-checker.component';
import { filter, switchMap, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { OrganizationsService } from '#shared/modules/common-services/organizations.service';
import { NotificationsService } from '#shared/modules/common-services/notifications.service';
import { UserService } from '#shared/modules/common-services/user.service';
import { innKppToLegalId } from '#shared/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { UserOrganizationModel } from '#shared/modules/common-services/models/user-organization.model';
import { AccessKeyComponent } from './components/access-key/access-key.component';
import { OrganizationResponseModel } from '#shared/modules/common-services/models/organization-response.model';
import { ParticipationRequestResponseModel } from '#shared/modules/common-services/models/participation-request-response.model';
import { ExternalProvidersService } from '#shared/modules/common-services/external-providers.service';
import { MetrikaEventTypeModel } from '#shared/modules/common-services/models';
import { LocalStorageService } from '#shared/modules';

type TabType = 'a' | 'b' | 'c';

class RegNotAllowError implements Error {
  message: string;
  name: string;

  constructor(message: string, name?: string) {
    this.message = message
    this.name = name
  }
}

@Component({
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss', './organizations.component-768.scss', './organizations.component-576.scss'],
})
export class OrganizationsComponent implements OnInit {
  existingOrganization: OrganizationResponseModel = null;
  checkedLegalRequisites = null;
  newSentRequests: number;
  private _activeTabType: TabType;

  get pageHeader(): string {
    if (this.activeTabType === 'c') {
      return 'Регистрация новой организации';
    }
    return 'Мои организации';
  }

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
      organizationId: this.existingOrganization.id,
      notes: `Заявка на присоединение к организации ${this.existingOrganization.name} от ${data.fio} (${data.email}). ${data.message}`,
    };
    this._organizationsService.sendParticipationRequest(bodyData).subscribe(
      (_) => {
        this.existingOrganization = null;
        this.goToTab('b');
      },
      (err) => {
        this._notificationsService.error('Произошла ошибка при подаче заявки на добавление в организацию');
      },
    );
  }

  registerOrganization(data: any) {
    const legalRequisites = {
      inn: data.inn,
      ...(data.kpp && { kpp: data.kpp }),
    };

    const contacts = {
      ...(data.organizationEmail && { email: data.organizationEmail }),
      ...(data.organizationPhone && { phone: data.organizationPhone }),
      ...(data.organizationWebsite && { website: data.organizationWebsite }),
      ...(data.organizationAddress && { address: data.organizationAddress }),
    };

    const contactPerson = {
      email: data.contactEmail,
      fullName: data.contactFio,
      phone: data.contactPhone,
    };

    const regOrgData = {
      legalRequisites,
      contactPerson,
      name: data.organizationName,
      ...(Object.keys(contacts).length && { contacts }),
      ...(data.organizationDescription && { description: data.organizationDescription }),
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
          this._notificationsService.error('Произошла ошибка при регистрации организации');
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
        this._notificationsService.error('Произошла ошибка при получении ключа доступа');
      },
    );
  }

  private _watchQueryParamsChanges() {
    this._activatedRoute.queryParams.pipe(filter((res) => res.tab)).subscribe(
      (res) => {
        const tabValue = res.tab.split(';')[0];
        switch (tabValue) {
          case 'a':
            this._setActiveTabType('a');
            break;
          case 'b':
            this._setActiveTabType('b');
            break;
          case 'c':
            this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.MODAL_CHECK_INN_SHOW);
            this._createRequisitesCheckerModal();
            break;
          default:
            this._setActiveTabType('a');
            break;
        }
      },
      (err) => {
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      },
    );
  }

  private _createRequisitesCheckerModal() {
    let legalRequisites = null;
    const modal = this._modalService.create({
      nzContent: RequisitesCheckerComponent,
      nzViewContainerRef: this._viewContainerRef,
      nzFooter: null,
      nzWidth: 480,
      nzComponentParams: {
        inn: this._activatedRoute.snapshot.queryParamMap.get('inn'),
        kpp: this._activatedRoute.snapshot.queryParamMap.get('kpp'),
      },
    });

    modal.afterClose.pipe(filter((res) => !res && this.activeTabType !== 'c')).subscribe(() => {
      this.goToTab(this.activeTabType);
    });

    const subscription = modal.componentInstance.legalRequisitesChange
      .pipe(
        switchMap((res) => {
          legalRequisites = {
            inn: res?.inn,
            kpp: res?.kpp,
          };
          const legalId = innKppToLegalId(res?.inn, res?.kpp);
          return this._organizationsService.getOrganizationByLegalId(legalId);
        }),
        switchMap((organization) => {
          if (this._hasOrganizationAccess(organization)) {
            this._setActiveTabType('a');
            return throwError(new RegNotAllowError(`Вы уже имеете доступ к организации с ИНН: ${legalRequisites.inn}${legalRequisites.kpp ? ` КПП: ${legalRequisites.kpp}` : ''}.`));
          }

          if (this._hasAlreadyRequest(legalRequisites)) {
            this._setActiveTabType('b');
            return throwError(new RegNotAllowError(`Ранее вы уже сформировли запрос на прикрепление к организации с ИНН: ${legalRequisites.inn}${legalRequisites.kpp ? ` КПП: ${legalRequisites.kpp}` : ''}.`));
          }
          return of(organization);
        })
      )
      .subscribe((organization) => {
          modal.destroy(true);
          subscription.unsubscribe();
          this.existingOrganization = organization;
          this.checkedLegalRequisites = legalRequisites;
          this._setActiveTabType('c');
        },
        (err) => {
          subscription.unsubscribe();
          modal.destroy(true);

          if (err instanceof RegNotAllowError) {
            this._notificationsService.info(err.message);
          } else {
            this._notificationsService.error('Произошла ошибка при получении информации об организации');
          }
        },
      );
  }

  private _hasOrganizationAccess(organization: OrganizationResponseModel) {
    return organization && this._userService.organizations$.getValue().some((item) => item.organizationId === organization.id);
  }

  private _hasAlreadyRequest(legalRequisites) {
    return this._userService.ownParticipationRequests$.getValue().some((part) =>
      part.requestStatus.resolutionStatus === 'PENDING' &&
      part.organization.legalRequisites.inn === legalRequisites.inn &&
      (!legalRequisites.kpp || part.organization.legalRequisites.kpp === legalRequisites.kpp));
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
        this._notificationsService.error('Произошла ошибка при получении запросов на присоединение');
      },
    );
  }
}
