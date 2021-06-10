import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { URL_RE, unsubscribeList } from '#shared/utils';
import { minDateValidator, notBlankValidator } from '#shared/utils/common-validators';
import { CountryCode, PriceListStatusEnum, UserOrganizationModel } from '#shared/modules/common-services/models';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { NotificationsService, PriceListsService, UserService } from '#shared/modules/common-services';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, take } from 'rxjs/operators';
import { WhiteListFormComponent } from '../white-list-form/white-list-form.component';
import { AddressSearchFormComponent } from '../address-search-form/address-search-form.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, Subscription, throwError } from 'rxjs';
import { deliveryRegionsOrPickupFromValidator } from '../../price-list-form-conditions.validator';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  templateUrl: './price-list-editing-form.component.html',
  styleUrls: ['./price-list-editing-form.component.scss'],
})
export class PriceListEditingFormComponent {
  form: FormGroup;
  currentDate = Date.now();
  availableOrganizations$: BehaviorSubject<UserOrganizationModel[]>;
  private dateActualToSubscription: Subscription;
  @ViewChild('successfulMessage') successfulMessageTpl: TemplateRef<any>;

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _userService: UserService,
    private _modalService: NzModalService,
    private _activatedRoute: ActivatedRoute,
    private _notification: NzNotificationService,
    private _priceListsService: PriceListsService,
    private _notificationsService: NotificationsService,
  ) {
    this.availableOrganizations$ = this._userService.organizations$;

    this._activatedRoute.params
      .pipe(
        switchMap((params) => {
          return this._priceListsService.getPriceList(params.priceListExternalId)
        })
      )
      .subscribe((priceList) => {
        if (priceList.feedInfo.status === PriceListStatusEnum.IN_PROGRESS) {
          this._notificationsService.info(`Ранее был запущен процесс автоматического обновления торговых предложений. Редактирование прайс-листа станет доступно после завершения процесса.`);
          this._router.navigateByUrl(`/my/sales`);
        } else {
          this.form = this._fb.group({
            priceListExternalUrl: this._fb.control(priceList.feedInfo.priceListExternalUrl, [Validators.required, Validators.pattern(URL_RE)]),
            name: this._fb.control(priceList.name, [Validators.required, notBlankValidator, Validators.maxLength(200)]),
            dateActualTo: this._fb.control(priceList.dateActualTo, [Validators.required, minDateValidator]),
            personName: this._fb.control(priceList.contacts.personName, [Validators.maxLength(200), notBlankValidator]),
            email: this._fb.control(priceList.contacts.email, [Validators.required, Validators.email, Validators.maxLength(100)]),
            phone: this._fb.control(priceList.contacts.phone, [Validators.maxLength(100)]),
            minSum: this._fb.control(priceList.orderRestrictions?.sum?.minimum ? priceList.orderRestrictions?.sum?.minimum / 100 : null, [Validators.min(0), Validators.max(Number.MAX_SAFE_INTEGER)]),
            emailForErrors: this._fb.control(priceList.feedInfo.contactsEmail, [Validators.email, Validators.maxLength(100)]),
            supplierPartyId: this._fb.control(priceList.supplierParty.id, [Validators.required]),
            audience: this._fb.array(this._initAudience(priceList.audience?.whiteList)),
            deliveryRegions: this._fb.array(this._initRegions(priceList.deliveryDescription?.deliveryRegions)),
            pickupFrom: this._fb.array(this._initRegions(priceList.deliveryDescription?.pickupFrom)),
            dateActualFrom: this._fb.control(priceList.dateActualFrom, [Validators.required]),
            externalCode: this._fb.control(priceList.externalCode),
            priceListId: this._fb.control(priceList.id),
          }, {
            validator: [deliveryRegionsOrPickupFromValidator],
          });

          this.form.markAllAsTouched();

          this.dateActualToSubscription = this.form.controls.dateActualTo.valueChanges
            .subscribe((date) => {
              this.form.controls.dateActualTo.patchValue(date?.toISOString().substr(0, 10), {
                emitEvent: false,
                onlySelf: true
              })
            });
        }
      });
  }

  ngOnDestroy(): void {
    unsubscribeList([this.dateActualToSubscription]);
  }

  disabledDate(current: Date): boolean {
    return differenceInCalendarDays(current, new Date()) < 0;
  }

  addOrg() {
    const modal = this._modalService.create({
      nzTitle: 'Введите реквизиты организации',
      nzContent: WhiteListFormComponent,
      nzFooter: null,
      nzWidth: 400,
      nzComponentParams: {}
    });

    modal.componentInstance.requisitesChange
      .pipe(take(1))
      .subscribe((res) => {
        if ((this.form.controls.audience.value as any[]).every((s) => s.inn !== res.inn || s.kpp !== res.kpp)) {
          (this.form.controls.audience as FormArray).push(this._fb.group({
            inn: this._fb.control(res.inn),
            kpp: this._fb.control(res.kpp),
            name: this._fb.control(res.name),
          }));
        }
        modal.destroy();
      });
  }

  addDeliveryRegion() {
    const modal = this._modalService.create({
      nzTitle: 'Укажите регион доставки товара',
      nzContent: AddressSearchFormComponent,
      nzFooter: null,
      nzWidth: 400,
      nzComponentParams: {
        type: 'deliveryRegion'
      }
    });

    modal.componentInstance.addressChange
      .pipe(take(1))
      .subscribe((res) => {
        if ((this.form.controls.deliveryRegions.value as any[]).every((s) => s.fiasCode !== res.fiasCode)) {
          (this.form.controls.deliveryRegions as FormArray).push(this._fb.group({
            name: this._fb.control(res.name),
            fiasCode: this._fb.control(res.fiasCode),
          }));
        }
        modal.destroy();
      });
  }

  addPickupFrom() {
    const modal = this._modalService.create({
      nzTitle: 'Укажите адрес склада самовывоза товара',
      nzContent: AddressSearchFormComponent,
      nzFooter: null,
      nzWidth: 400,
      nzComponentParams: {
        type: 'pickupFrom'
      }
    });

    modal.componentInstance.addressChange
      .pipe(take(1))
      .subscribe((res) => {
        if ((this.form.controls.pickupFrom.value as any[]).every((s) => s.fiasCode !== res.fiasCode)) {
          (this.form.controls.pickupFrom as FormArray).push(this._fb.group({
            name: this._fb.control(res.name),
            fiasCode: this._fb.control(res.fiasCode),
          }));
        }
        modal.destroy();
      });
  }

  deleteDeliveryRegion(item: any) {
    const index = (this.form.controls.deliveryRegions.value as any[]).findIndex(f => f.fiasCode === item.fiasCode);
    if (index >= 0) {
      (this.form.controls.deliveryRegions as FormArray).removeAt(index);
    }
  }

  deletePickupFrom(item: any) {
    const index = (this.form.controls.pickupFrom.value as any[]).findIndex(f => f.fiasCode === item.fiasCode);
    if (index >= 0) {
      (this.form.controls.pickupFrom as FormArray).removeAt(index);
    }
  }

  deleteOrg(item: any) {
    const index = (this.form.controls.audience.value as any[]).findIndex(f => f.inn === item.inn && f.kpp === item.kpp);
    if (index >= 0) {
      (this.form.controls.audience as FormArray).removeAt(index);
    }
  }

  save() {
    this._priceListsService.getPriceListFeed(this.form.controls.externalCode.value)
      .pipe(
        switchMap((feed) => {
          if (feed.status === PriceListStatusEnum.IN_PROGRESS) {
            return throwError(new Error('Ранее был запущен процесс автоматического обновления торговых предложений. Сохраненить изменения невозможно, попробуйте позже.'));
          }
          return this._priceListsService.updatePriceList(this.form.controls.priceListId.value, this._formToPriceList())
        }),
        switchMap(() => {
          return this._priceListsService.placePriceListFeed(this.form.controls.externalCode.value,
            {
              supplierOrganizationId: this.form.controls.supplierPartyId.value,
              priceListExternalUrl: this.form.controls.priceListExternalUrl.value,
              contactsEmail: this.form.controls.emailForErrors.value || this.form.controls.email.value,
            })
        }),
        switchMap(() => {
          return this._priceListsService.startFeed(this.form.controls.externalCode.value);
        }),
      )
      .subscribe(() => {
        this._notification.template(this.successfulMessageTpl, {
          nzDuration: 8000,
          nzPlacement: 'topRight',
          nzPauseOnHover: true,
          nzStyle: {
            width: 'auto',
            maxWidth: '900px',
            margin: '10px auto 0 auto'
          },
        });
        this._router.navigateByUrl(`/my/sales`);
      }, (err) => {
        if (err.message.includes('обновления')) {
          this._notificationsService.info(err.message);
        } else {
          this._notificationsService.error();
        }
      });
  }

  private _formToPriceList() {
    return {
      dateActualFrom: this.form.controls.dateActualFrom.value,
      dateActualTo: this.form.controls.dateActualTo.value,
      name: this.form.controls.name.value,
      currencyCode: CountryCode.RUSSIA,
      externalCode: this.form.controls.externalCode.value,
      supplierPartyId: this.form.controls.supplierPartyId.value,
      contacts: {
        ...(this.form.controls.personName.value && { personName: this.form.controls.personName.value }),
        ...(this.form.controls.phone.value && { phone: this.phone(this.form.controls.phone.value) }),
        email: this.form.controls.email.value
      },
      ...(this.form.controls.minSum.value && {
        orderRestrictions: {
          sum: {
            minimum: +this.form.controls.minSum.value * 100,
            includesVAT: true
          }
        }
      }),
      deliveryDescription: {
        ...(this.form.controls.deliveryRegions.value.length && {
          deliveryRegions: (this.form.controls.deliveryRegions.value as []).map((delivery: any) => {
            return {
              countryOksmCode: CountryCode.RUSSIA,
              ...(delivery.fiasCode && { fiasCode: delivery.fiasCode })
            }
          }),
        }),
        ...(this.form.controls.pickupFrom.value.length && {
          pickupFrom: (this.form.controls.pickupFrom.value as []).map((pickup: any) => {
            return {
              countryOksmCode: CountryCode.RUSSIA,
              fiasCode: pickup.fiasCode
            }
          }),
        }),
      },
      ...(this.form.controls.audience.value?.length && {
        audience: {
          whiteList: (this.form.controls.audience.value as []).map((audience: any) => {
            return {
              inn: audience.inn,
              ...(audience.kpp && { kpp: audience.kpp }),
            }
          }),
        }
      })
    };
  }

  private _initAudience(whiteList: any[]): FormGroup[] {
    return whiteList?.map((item) => this._fb.group({
      inn: this._fb.control(item.inn),
      kpp: this._fb.control(item.kpp),
      name: this._fb.control(item.name),
    })) || [];
  }

  private _initRegions(regions: any[]) {
    return regions?.map((item) => this._fb.group({
      name: item.name,
      fiasCode: item.fiasCode,
      countryOksmCode: item.countryOksmCode,
    })) || [];
  }

  private phone(value: string) {
    if (value.includes('+7')) {
      return value;
    }
    return `+7${value}`;
  }
}

