import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { URL_RE, unsubscribeList } from '#shared/utils';
import { v4 as uuid } from 'uuid';
import { CountryCode, UserOrganizationModel } from '#shared/modules/common-services/models';
import { notBlankValidator } from '#shared/utils/common-validators';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { NzModalService } from 'ng-zorro-antd/modal';
import { WhiteListFormComponent } from '../white-list-form/white-list-form.component';
import { AddressSearchFormComponent } from '../address-search-form/address-search-form.component';
import { NotificationsService, PriceListsService, UserService } from '#shared/modules/common-services';
import { switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { saveAs } from 'file-saver';
import { deliveryRegionsOrPickupFromValidator } from '../../price-list-form-conditions.validator';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  templateUrl: './price-list-creating-form.component.html',
  styleUrls: [
    './price-list-creating-form.component.scss',
    './price-list-creating-form.component-576.scss'
  ],
})
export class PriceListCreatingFormComponent implements OnInit, OnDestroy {
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
    private _notification: NzNotificationService,
    private _priceListsService: PriceListsService,
    private _notificationsService: NotificationsService,
  ) {
    this.availableOrganizations$ = this._userService.organizations$;
  }

  get initSupplierPartyId(): string {
    if (this.availableOrganizations$.getValue()?.length === 1) {
      return this.availableOrganizations$.getValue()[0].organizationId;
    }
    return null;
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      priceListExternalUrl: this._fb.control(null, [Validators.required, Validators.pattern(URL_RE)]),
      name: this._fb.control(null, [Validators.required, notBlankValidator, Validators.maxLength(200)]),
      dateActualTo: this._fb.control(null, [Validators.required]),
      personName: this._fb.control(null, [Validators.maxLength(200), notBlankValidator]),
      email: this._fb.control(null, [Validators.required, Validators.email, Validators.maxLength(100)]),
      phone: this._fb.control(null, [Validators.maxLength(100)]),
      minSum: this._fb.control(null, [Validators.min(0), Validators.max(Number.MAX_SAFE_INTEGER)]),
      emailForErrors: this._fb.control(null, [Validators.email, Validators.maxLength(100)]),
      supplierPartyId: this._fb.control(this.initSupplierPartyId, [Validators.required]),
      audience: this._fb.array([]),
      deliveryRegions: this._fb.array([]),
      pickupFrom: this._fb.array([]),
      dateActualFrom: this._fb.control(new Date().toISOString().substr(0, 10), [Validators.required]),
      externalCode: this._fb.control(`bnet-market-${uuid()}`),
    }, {
      validator: [deliveryRegionsOrPickupFromValidator],
    });

    this.dateActualToSubscription = this.form.controls.dateActualTo.valueChanges
      .subscribe((date) => {
        this.form.controls.dateActualTo.patchValue(date.toISOString().substr(0, 10), {
          emitEvent: false,
          onlySelf: true
        })
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
    this._priceListsService.placePriceList(this._formToPriceList())
      .pipe(
        switchMap(() => {
          return this._priceListsService.placePriceListFeed(this.form.controls.externalCode.value,
            {
              supplierOrganizationId: this.form.controls.supplierPartyId.value,
              priceListExternalUrl: this.form.controls.priceListExternalUrl.value,
              contactsEmail: this.form.controls.emailForErrors.value || this.form.controls.email.value,
            });
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
        })
        this._router.navigateByUrl(`/my/sales`);
      }, (err) => {
        this._notificationsService.error(err);
      });
  }

  downloadTemplate() {
    this._priceListsService.getPriceListTemplateFile()
      .subscribe((content) => {
        const blob = new Blob([new Uint8Array(content.data)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'price-list.xlsx');
      })
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
        ...(this.form.controls.phone.value && { phone: `+7${this.form.controls.phone.value}` }),
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
}

