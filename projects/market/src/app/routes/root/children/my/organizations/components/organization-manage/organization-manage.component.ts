import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizationResponseModel } from '#shared/modules/common-services/models/organization-response.model';
import { notBlankValidator } from '#shared/utils/common-validators';
import { innKppToLegalId, unsubscribeList, URL_RE } from '#shared/utils';
import {
  innConditionValidator,
  kppConditionValidator,
  kppRequiredIfOrgConditionValidator
} from '#shared/utils/organization-requisite-validators';
import { switchMap } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { NotificationsService, OrganizationsService, UserService } from '#shared/modules';
import { ActivatedRoute, Router } from '@angular/router';

type OperationType = 'register' | 'edit';

@Component({
  selector: 'market-organization-manage',
  templateUrl: './organization-manage.component.html',
  styleUrls: [
    './organization-manage.component.scss',
  ],
})
export class OrganizationManageComponent implements OnInit, OnDestroy {
  regOrgForm: FormGroup;
  joinOrgForm: FormGroup;
  currentDate = Date.now();

  @Input() organizationData: OrganizationResponseModel;
  @Input() operationType: OperationType = 'register';
  @Input() legalRequisites: { inn: string; kpp?: string; };

  @Output() organizationDataChange: EventEmitter<any> = new EventEmitter();
  @Output() requestDataChange: EventEmitter<any> = new EventEmitter();

  @ViewChild('elementInputInn') elementInputInn: ElementRef;
  @ViewChild('elementInputKpp') elementInputKpp: ElementRef;
  @ViewChild('elementInputName') elementInputName: ElementRef;

  @ViewChild('elementInputContactsPhone') elementInputContactsPhone: ElementRef;
  @ViewChild('elementInputContactsEmail') elementInputContactsEmail: ElementRef;
  @ViewChild('elementInputContactsWebsite') elementInputContactsWebsite: ElementRef;

  @ViewChild('elementInputContactsAddress') elementInputContactsAddress: ElementRef;
  @ViewChild('elementDescription') elementDescription: ElementRef;

  @ViewChild('elementInputContactPersonFullName') elementInputContactPersonFullName: ElementRef;
  @ViewChild('elementInputContactPersonPhone') elementInputContactPersonPhone: ElementRef;
  @ViewChild('elementInputContactPersonEmail') elementInputContactPersonEmail: ElementRef;

  @ViewChild('elementIsOrganizationAgent') elementIsOrganizationAgent: ElementRef;

  @ViewChild('elementInputPersonName') elementInputPersonName: ElementRef;
  @ViewChild('elementInputPersonEmail') elementInputPersonEmail: ElementRef;
  @ViewChild('elementMessageForAdmin') elementMessageForAdmin: ElementRef;

  private _innSubscription: Subscription;
  private _kppSubscription: Subscription;


  get isRegistration(): boolean {
    return this.operationType === 'register';
  }

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _userService: UserService,
    private _activatedRoute: ActivatedRoute,
    private _notificationsService: NotificationsService,
    private _organizationsService: OrganizationsService,
  ) {
  }

  ngOnInit(): void {
    this._initJoinOrgForm();
    this._initRegOrgForm();

    if (this.isRegistration) {
      this._watchConsumerInnValueChanges();
      this._watchConsumerKppValueChanges();
      this._substituteInnKppIfNecessary();
    }
  }

  ngOnDestroy(): void {
    unsubscribeList([
      this._innSubscription,
      this._kppSubscription,
    ]);
  }

  private _initJoinOrgForm(): void {
    this.joinOrgForm = this._fb.group({
      isOrgExists: this._fb.control(false),
      organizationId: this._fb.control(null),
      organizationName: this._fb.control(null),
      personName: this._fb.control(null,
        [Validators.required, notBlankValidator, Validators.minLength(3), Validators.maxLength(150)]),
      personEmail: this._fb.control(this.organizationData?.contactPerson?.email,
        [Validators.required, Validators.email, Validators.maxLength(100)]),
      messageForAdmin: this._fb.control(null,
        [Validators.required, notBlankValidator, Validators.maxLength(110)]),
    });
  }

  private _initRegOrgForm(): void {
    this.regOrgForm = this._fb.group({
      inn: this._fb.control({ value: this.legalRequisites?.inn, disabled: !this.isRegistration },
        [Validators.required, notBlankValidator, Validators.pattern('^[0-9]*$'), innConditionValidator]),
      kpp: this._fb.control({ value: this.legalRequisites?.kpp, disabled: !this.isRegistration },
        [Validators.pattern('^[0-9]*$'), notBlankValidator, kppConditionValidator, kppRequiredIfOrgConditionValidator('inn')]),
      name: this._fb.control(this.organizationData?.name,
        [Validators.required, notBlankValidator, Validators.minLength(3), Validators.maxLength(150)]),
      description: this._fb.control(this.organizationData?.description,
        [notBlankValidator, Validators.maxLength(1000)]),
      contactsEmail: this._fb.control(this.organizationData?.contacts?.email,
        [Validators.email, Validators.maxLength(100)]),
      contactsPhone: this._fb.control(this.organizationData?.contacts?.phone,
        [Validators.maxLength(16)]),
      contactsWebsite: this._fb.control(this.organizationData?.contacts?.website,
        [Validators.maxLength(100), Validators.pattern(URL_RE)]),
      contactsAddress: this._fb.control(this.organizationData?.contacts?.address,
        [notBlankValidator, Validators.maxLength(500)]),
      contactPersonFullName: this._fb.control(this.organizationData?.contactPerson?.fullName,
        [Validators.required, notBlankValidator, Validators.maxLength(100)]),
      contactPersonEmail: this._fb.control(this.organizationData?.contactPerson?.email,
        [Validators.required, Validators.email, Validators.maxLength(100)]),
      contactPersonPhone: this._fb.control(this.organizationData?.contactPerson?.phone,
        [Validators.required, Validators.maxLength(16)]),
      isOrganizationAgent: this._fb.control(!this.isRegistration, [Validators.requiredTrue]),
    });
  }

  save() {
    if (this.regOrgForm.invalid) {
      this.regOrgForm.markAllAsTouched();

      if (this.regOrgForm.controls.isOrganizationAgent.invalid) {
        this.elementIsOrganizationAgent?.nativeElement.scrollIntoView({ block: 'center', inline: 'nearest' });
      }

      if (this.regOrgForm.controls.contactPersonEmail.invalid) {
        this.elementInputContactPersonEmail?.nativeElement.focus();
      }

      if (this.regOrgForm.controls.contactPersonPhone.invalid) {
        this.elementInputContactPersonPhone?.nativeElement.focus();
      }

      if (this.regOrgForm.controls.contactPersonFullName.invalid) {
        this.elementInputContactPersonFullName?.nativeElement.focus();
      }

      if (this.regOrgForm.controls.description.invalid) {
        this.elementDescription?.nativeElement.focus();
      }

      if (this.regOrgForm.controls.contactsAddress.invalid) {
        this.elementInputContactsAddress?.nativeElement.focus();
      }

      if (this.regOrgForm.controls.contactsWebsite.invalid) {
        this.elementInputContactsWebsite?.nativeElement.focus();
      }

      if (this.regOrgForm.controls.contactsEmail.invalid) {
        this.elementInputContactsEmail?.nativeElement.focus();
      }

      if (this.regOrgForm.controls.contactsPhone.invalid) {
        this.elementInputContactsPhone?.nativeElement.focus();
      }

      if (this.regOrgForm.controls.name.invalid) {
        this.elementInputName?.nativeElement.focus();
      }

      if (this.regOrgForm.controls.kpp.invalid) {
        this.elementInputKpp?.nativeElement.focus();
      }

      if (this.regOrgForm.controls.inn.invalid) {
        this.elementInputInn?.nativeElement.focus();
      }
      return;
    }

    this.organizationDataChange.emit(this.regOrgForm.value);
  }

  send() {
    if (this.joinOrgForm.invalid) {
      this.joinOrgForm.markAllAsTouched();

      if (this.joinOrgForm.controls.messageForAdmin.invalid) {
        this.elementMessageForAdmin?.nativeElement.focus();
      }

      if (this.joinOrgForm.controls.personEmail.invalid) {
        this.elementInputPersonEmail?.nativeElement.focus();
      }

      if (this.joinOrgForm.controls.personName.invalid) {
        this.elementInputPersonName?.nativeElement.focus();
      }
      return;
    }

    this.requestDataChange.emit(this.joinOrgForm.value);
  }

  private _watchConsumerKppValueChanges() {
    this._kppSubscription = this.regOrgForm.get('kpp').valueChanges
      .pipe(
        switchMap(() => {
          if (this.regOrgForm.get('inn').valid && (this.regOrgForm.get('kpp').valid || this.regOrgForm.get('inn').value?.length === 12)) {
            const legalId = innKppToLegalId(this.regOrgForm.get('inn').value, this.regOrgForm.get('kpp').value);
            return this._organizationsService.getOrganizationByLegalId(legalId);
          }

          return of(null);
        }),
      )
      .subscribe((org) => {
        if (org) {
          if (this._hasOrganizationAccess(org.id)) {
            this.regOrgForm.setErrors({ hasOrganizationAccess: true }, { emitEvent: true });
          } else if (this._hasAlreadyRequest()) {
            this.regOrgForm.setErrors({ hasAlreadyRequest: true }, { emitEvent: true });
          } else {
            this.joinOrgForm.patchValue({
              organizationId: org.id,
              organizationName: org.name,
              isOrgExists: true,
            }, { emitEvent: true, onlySelf: true })
          }
        } else {
          this.joinOrgForm.controls.isOrgExists.patchValue(false, { emitEvent: true, onlySelf: true });
        }

      }, (err) => {
        this._notificationsService.error(err);
      });
  }

  private _hasOrganizationAccess(organizationId: string) {
    return organizationId && this._userService.organizations$.getValue().some((item) => item.organizationId === organizationId);
  }

  private _hasAlreadyRequest() {
    return this._userService.ownParticipationRequests$.getValue().some((part) =>
      part.requestStatus.resolutionStatus === 'PENDING' &&
      part.organization.legalRequisites.inn === this.regOrgForm.get('inn').value &&
      (!this.regOrgForm.get('kpp').value || part.organization.legalRequisites.kpp === this.regOrgForm.get('kpp').value));
  }

  private _watchConsumerInnValueChanges() {
    this._innSubscription = this.regOrgForm.get('inn').valueChanges
      .pipe(
        switchMap((inn) => {
          this.regOrgForm.controls.kpp.patchValue(null, { emitEvent: true, onlySelf: true });
          this.regOrgForm.controls.name.patchValue(null, { emitEvent: true, onlySelf: true });

          if ((inn.length === 10 || inn.length === 12) && this.regOrgForm.get('inn').valid) {
            return this._organizationsService.findCounterpartyDataByInn(inn);
          }
          return of(null);
        }),
      )
      .subscribe((org) => {
        if (org) {
          this.regOrgForm.controls.kpp.patchValue(org.kpp, { emitEvent: true, onlySelf: true });
          this.regOrgForm.controls.name.patchValue(org.name, { emitEvent: true, onlySelf: true });
        }
      });
  }

  private _substituteInnKppIfNecessary() {
    if (this._activatedRoute.snapshot.queryParamMap.get('inn')) {
      this.regOrgForm.controls.inn.patchValue(this._activatedRoute.snapshot.queryParamMap.get('inn'), { emitEvent: true, onlySelf: true });
    }

    if (this._activatedRoute.snapshot.queryParamMap.get('kpp')) {
      this.regOrgForm.controls.kpp.patchValue(this._activatedRoute.snapshot.queryParamMap.get('kpp'), { emitEvent: true, onlySelf: true });
    }
  }
}

