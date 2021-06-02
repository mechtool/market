import { Component, ElementRef, OnInit } from '@angular/core';
import {
  CountryCode,
  Level,
  LocalStorageService,
  LocationModel,
  LocationService,
  NotificationsService,
  OrganizationsService,
  RfpItemResponseAttachmentModel,
  RfpItemResponseModel,
  RfpItemResponsePositionModel,
  UserOrganizationModel,
  UserService
} from '#shared/modules';
import { defer, forkJoin, fromEvent, Observable, of } from 'rxjs';
import {catchError, debounceTime, filter, map, pairwise, startWith, switchMap, take, tap} from 'rxjs/operators';
import { dataURLtoBlobSize, innKppToLegalId, uniqueArray } from '#shared/utils';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { saveAs } from 'file-saver';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { WhiteListFormComponent } from '../white-list-form/white-list-form.component';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import format from 'date-fns/format';
import { BarcodeFormComponent } from '../barcodes-form/barcode-form.component';
import { dateIsLessThanDate } from '#shared/validators/dates-collecting.validator';
import { AbbreviatedBusinessNamePipe } from '#shared/modules/pipes/abbreviated-business-name.pipe';
import { RfpsService } from '../../rfps.service';

interface IAudienceParty {
  inn: string | number;
  kpp?: string | number;
  name?: string;
}

interface IOption {
  fias: string;
  name: string;
}

@Component({
  selector: 'market-rfp-edit-component',
  templateUrl: './rfp-edit.component.html',
  styleUrls: [
    './rfp-edit.component.scss',
    './rfp-edit.component-992.scss'
  ]
})
export class RfpEditComponent implements OnInit {
  currentDate = Date.now();
  maxFilesNumber = 5;
  maxFilesSize = 5e6;
  foundCities: any[];
  type: string = null;
  restrictionTypeOptions = [
    { label: 'Всем', value: null },
    { label: 'Всем кроме', value: 'BLACK_LIST' },
    { label: 'Только', value: 'WHITE_LIST' },
  ];

  form: FormGroup;
  acceptedMimeTypesToUpload = [
    'image/jpeg', 'image/png','image/gif', 'application/pdf', 'text/csv', 'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip',
    'text/plain', 'application/vnd.oasis.opendocument.presentation', 'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.text', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ].join(',');
  userOrganizations: UserOrganizationModel[] = null;
  audienceOrganizations: IAudienceParty[] = null;
  deliveryRegion: LocationModel;
  rfpData: RfpItemResponseModel = null;

  get attachments(): FormArray {
    return this.form.get('attachments') as FormArray;
  }

  get attachmentsControls(): FormGroup[] {
    return this.attachments.controls as FormGroup[];
  }

  get audienceParties(): FormArray {
    return this.form.get('audienceParties') as FormArray;
  }

  get audiencePartiesControls(): FormGroup[] {
    return this.audienceParties.controls as FormGroup[];
  }

  get positions(): FormArray {
    return this.form.get('positions') as FormArray;
  }

  get positionsItemsControls(): FormGroup[] {
    return this.positions.controls as FormGroup[];
  }

  getProductBarcodes(i: number): FormArray {
    return this.positions.at(i).get('productCustomerSpecificationBarCodes') as FormArray;
  }

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private _router: Router,
    private _userService: UserService,
    private _rfpsService: RfpsService,
    private _notificationsService: NotificationsService,
    private _organizationsService: OrganizationsService,
    private _modalService: NzModalService,
    private _locationService: LocationService,
    private _localStorageService: LocalStorageService,
    private _el: ElementRef,
  ) { }

  ngOnInit(): void {
    this._init()
      .pipe(
        tap(() => {
          this._initForm();
          this._handleDeliveryRegionChanges();
          this._handleSelectedOrganizationChanges();
          this._setType();
        }),
        take(1),
      ).subscribe();
  }

  private _init(): Observable<any> {
    return this._activatedRoute.paramMap
      .pipe(
        map((paramMap) => paramMap.get('id')),
        switchMap((id: string) => {
          return defer(() => {
            return !!id ? this._setRfpDataAndAudienceParties(id) : of(null)
          })
        }),
        switchMap(() => {
          return this._userService.organizations$.asObservable().pipe(take(1))
            .pipe(
              tap((res) => this.userOrganizations = res)
            );
        }),
        switchMap(() => {
          if (this.rfpData?.proposalRequirements?.termsAndConditions?.deliveryRegion) {
            return this._locationService.getLocations([this.rfpData.proposalRequirements.termsAndConditions.deliveryRegion.fiasRegionCode])
              .pipe(
                tap((res) => {
                  if (res?.length) {
                    this.deliveryRegion = res[0];
                  }
                }),
              );
          }
          if (this._localStorageService.isApproveRegion() && this._localStorageService.getUserLocation()?.fias) {
            this.deliveryRegion = this._localStorageService.getUserLocation();
          }
          return of(null);
        }),
      )
  }

  private _setRfpDataAndAudienceParties(id: string): Observable<any> {
    return this._rfpsService.getUserRfpById(id).pipe(
      tap((rfpData) => this.rfpData = rfpData),
      switchMap((res: RfpItemResponseModel) => {
        return defer(() => {
          if (res?.audience?.parties?.length) {
            const audiencePartiesLegalIds = res.audience.parties.map((party) => innKppToLegalId(party?.inn, party?.kpp));
            return forkJoin(audiencePartiesLegalIds.map((legalId) => this._organizationsService.getOrganizationByLegalId(legalId)))
          }
          return of(null);
        })
      }),
      tap((audienceOrganizations: any[]) => {
        if (audienceOrganizations) {
          this.audienceOrganizations = audienceOrganizations
            .filter((org) => !!org)
            .map((org) => {
              return {
                inn: org.legalRequisites?.inn,
                kpp: org.legalRequisites?.kpp,
                name: org.name,
              }
            });
        }
      }),
    )
  }

  private _initForm(): void {
    this.form = this._fb.group({
      attachments: this._getAttachments(this.rfpData?.attachments || null),
      audienceParties: this._getAudienceParties(this.audienceOrganizations || null),
      positions: this._getPositions(this.rfpData?.proposalRequirements?.positions || null),
      id: this._fb.control(this.rfpData?.id || null),
      // tslint:disable-next-line:max-line-length
      audienceRestrictionType: this._fb.control(this.rfpData ? this._getRestrictionTypeValue(this.rfpData, this.restrictionTypeOptions) : null),
      dateCancelled: this._fb.control(this.rfpData?.dateCancelled || null),
      dateLastUpdated: this._fb.control(this.rfpData?.dateLastUpdated || null),
      datePlaced: this._fb.control(this.rfpData?.datePlaced || null),
      // tslint:disable-next-line:max-line-length
      documentOrderNumber: this._fb.control(this.rfpData?.documentOrderNumber || `Запрос ${(new AbbreviatedBusinessNamePipe).transform(this.userOrganizations[0]?.organizationName)} от ${format(new Date(), 'dd-MM-yyyy HH-mm')}`, [Validators.required, Validators.maxLength(150)]),
      contactName: this._fb.control(this.rfpData?.proposalRequirements?.contacts?.contactName || null, [Validators.maxLength(200)]),
      // tslint:disable-next-line:max-line-length
      contactEmail: this._fb.control(this.rfpData?.proposalRequirements?.contacts?.email || null, [Validators.required, Validators.maxLength(100), Validators.email]),
      contactPhone: this._fb.control(this.rfpData?.proposalRequirements?.contacts?.phone || null, [Validators.maxLength(16)]),
      // tslint:disable-next-line:max-line-length
      dateCollectingFrom: this._fb.control(this.rfpData?.proposalRequirements?.termsAndConditions?.dateCollectingFrom || null, [Validators.required]),
      // tslint:disable-next-line:max-line-length
      dateCollectingTo: this._fb.control(this.rfpData?.proposalRequirements?.termsAndConditions?.dateCollectingTo || null, [Validators.required, dateIsLessThanDate('dateCollectingFrom', 'dateCollectingTo')]),
      // tslint:disable-next-line:max-line-length
      dateConsideringTo: this._fb.control(this.rfpData?.proposalRequirements?.termsAndConditions?.dateConsideringTo || null, [Validators.required, dateIsLessThanDate('dateCollectingTo', 'dateConsideringTo')]),
      deliveryRegion: this._fb.control(this.deliveryRegion?.locality || this.deliveryRegion?.name || null),
      // tslint:disable-next-line:max-line-length
      selectedOrganization: this._fb.control(this.rfpData ? this._getSelectedOrganization(this.userOrganizations, this.rfpData) : this.userOrganizations[0], [Validators.required]),
    });
  }

  private _handleDeliveryRegionChanges() {
    this.form.get('deliveryRegion').valueChanges
      .pipe(
        switchMap((city) => {
          if (city?.length > 1) {
            return this._locationService.searchAddresses({ deliveryCity: city }, Level.CITY);
          }
          return of([]);
        }),
        catchError((err) => {
          return of([]);
        }),
      ).subscribe((cities) => {
        this.foundCities = cities.filter(uniqueArray);
      },
      (err) => {
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      },
    );
  }

  private _handleSelectedOrganizationChanges() {

    this.form.get('selectedOrganization')
      .valueChanges
      .pipe(
        startWith(null as string),
        pairwise(),
        filter(([prev, next]) => {
          return prev !== null && JSON.stringify(prev) !== JSON.stringify(next) && this.form.get('documentOrderNumber').pristine;
        })
      ).subscribe(([,selectedOrganization]) => {
        this.form.get('documentOrderNumber').patchValue(`Запрос ${(new AbbreviatedBusinessNamePipe).transform(selectedOrganization.organizationName)} от ${format(new Date(), 'dd-MM-yyyy HH-mm')}`);
      },
      (err) => {
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      },
    );
  }

  private _setType() {
    this.type = this._activatedRoute.snapshot.routeConfig.path === 'create' ? 'RFP_CREATE' : 'RFP_EDIT';
  }

  compareFun = (o1: IOption | string, o2: IOption) => {
    if (o1) {
      return typeof o1 === 'string' ? o1 === o2.name : o1.fias === o2.fias;
    }
    return false;
  };

  private _getAttachments(attachmentsRaw: RfpItemResponseAttachmentModel[]): FormArray {
    const attachmentsList = this._fb.array([]);
    if (!attachmentsRaw) {
      return attachmentsList;
    }
    attachmentsRaw?.forEach((rawAttachment) => {
      attachmentsList.push(this._createAttachmentItem(rawAttachment));
    });
    return attachmentsList;
  }

  private _getAudienceParties(audienceParties: IAudienceParty[]): FormArray {
    const audiencePartiesList = this._fb.array([]);
    if (!audienceParties) {
      return audiencePartiesList;
    }
    audienceParties?.forEach((audienceParty) => {
      audiencePartiesList.push(this._createAudiencePartyItem(audienceParty));
    });
    return audiencePartiesList;
  }

  private _getPositions(positionsRaw: RfpItemResponsePositionModel[]): FormArray {
    const positionsList = this._fb.array([], Validators.required);
    if (!positionsRaw) {
      positionsList.push(this.createPositionItem());
      return positionsList;
    }
    positionsRaw?.forEach((positionRaw) => {
      positionsList.push(this.createPositionItem(positionRaw));
    });
    return positionsList
  }

  private _createAttachmentItem(item?: RfpItemResponseAttachmentModel): FormGroup {
    return this._fb.group({
      name: this._fb.control(item.name, [Validators.maxLength(100)]),
      title: this._fb.control(item.title, [Validators.maxLength(100)]),
      content: this._fb.control(item.content, [Validators.required]),
    })
  }

  private _createAudiencePartyItem(item: IAudienceParty): FormGroup {
    return this._fb.group({
      inn: this._fb.control(item.inn || null, [Validators.required, Validators.pattern('^[0-9]*$')]),
      kpp: this._fb.control(item.kpp || null, [Validators.pattern('^[0-9]*$')]),
      name: this._fb.control(item.name || null),
    });
  }

  createPositionItem(item?: RfpItemResponsePositionModel): FormGroup {
    return this._fb.group({
      // positionCorrelationId: this._fb.control({ value: item?.positionCorrelationId || uuidv4(), disabled: true }),
      positionCorrelationId: this._fb.control(item?.positionCorrelationId || uuidv4()),
      // tslint:disable-next-line:max-line-length
      productCustomerSpecificationProductName: this._fb.control(item?.product?.customerSpecification?.productName || null, [Validators.required, Validators.maxLength(200)]),
      // tslint:disable-next-line:max-line-length
      productCustomerSpecificationProductDescription: this._fb.control(item?.product?.customerSpecification?.productDescription || null, [Validators.maxLength(500)]),
      // tslint:disable-next-line:max-line-length
      productCustomerSpecificationPartNumber: this._fb.control(item?.product?.customerSpecification?.partNumber || null, [Validators.maxLength(100)]),
      // tslint:disable-next-line:max-line-length
      productCustomerSpecificationBarCodes: this._fb.array(item?.product?.customerSpecification?.barCodes?.map((b) => this._createBarCodeItem(b)) || []),
      // tslint:disable-next-line:max-line-length
      purchaseConditionsMaxPrice: this._fb.control(item?.purchaseConditions?.maxPrice || null, [Validators.min(0), Validators.max(1e9)]),
      // tslint:disable-next-line:max-line-length
      purchaseConditionsNumberOfPackages: this._fb.control(item?.purchaseConditions?.numberOfPackages || null, [Validators.required, Validators.min(0.001), Validators.max(1e6)]),
      // tslint:disable-next-line:max-line-length
      purchaseConditionsDateDesiredDeliveryTo: this._fb.control(item?.purchaseConditions?.dateDesiredDeliveryTo || null, [dateIsLessThanDate('dateConsideringTo', 'purchaseConditionsDateDesiredDeliveryTo', false)]),
    })
  }


  private _createBarCodeItem(barCode?: string): FormGroup {
    return this._fb.group({
      value: this._fb.control(barCode || null, [Validators.maxLength(200)]),
    })
  }

  private _getSelectedOrganization(userOrganizations: UserOrganizationModel[], rfpData: RfpItemResponseModel) {
    let selectedOrganization = userOrganizations[0];
    if (rfpData?.proposalRequirements?.customerPartyId) {
      selectedOrganization = userOrganizations.find((org) => org.organizationId === rfpData.proposalRequirements.customerPartyId);
    }
    return selectedOrganization;
  }

  private _getRestrictionTypeValue(rfpData: RfpItemResponseModel, restrictionTypeOptions: { label: string, value: string }[]) {
    const restrictionType = rfpData.audience?.restrictionType;
    const isRestrictionTypeValid = restrictionTypeOptions.some((opt) => {
      return opt.value === restrictionType;
    });
    return isRestrictionTypeValid ? restrictionType : null;
  }

  downloadFile(base64content: string, fileName?: string): void {
    if (fileName) {
      saveAs(base64content, fileName);
      return;
    }
    saveAs(base64content);
  }

  openModalAddAudienceParty() {
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
        if ((this.form.get('audienceParties').value as any[]).every((s) => s.inn !== res.inn || s.kpp !== res.kpp)) {
          this._addAudiencePartyByIndex(res);
        }
        modal.destroy();
      }, (err) => {
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      });
  }

  private _addAudiencePartyByIndex(audiencePatyy: IAudienceParty): void {
    const audiencePartiesList = this.form.get('audienceParties') as FormArray
    audiencePartiesList.push(this._createAudiencePartyItem(audiencePatyy));
  }

  removeAudiencePartyByIndex(index: number): void {
    this.audienceParties.removeAt(index);
  }

  removeAttachmentByIndex(index: number): void {
    const attachments = this.form.get('attachments') as FormArray;
    attachments.removeAt(index);
  }

  removeBarcodeByIndex(indexI: number, indexJ: number): void {
    const position = this.positions.at(indexI) as FormGroup;
    const productCustomerSpecificationBarCodes = position.get('productCustomerSpecificationBarCodes') as FormArray;
    productCustomerSpecificationBarCodes.removeAt(indexJ);
  }

  handleInputChange(e): void {
    const currentAttachmentsArr = this.attachments.value;
    const currentAttachmentsSize = currentAttachmentsArr.reduce((accum, curr) => {
      accum += dataURLtoBlobSize(curr.content);
      return accum;
    }, 0);

    const fileList: File[] = Array.from(e.dataTransfer ? e.dataTransfer.files : e.target.files);
    const fileListSize = fileList.reduce((accum, curr) => {
      accum += curr.size;
      return accum;
    }, 0);

    const totalSize = currentAttachmentsSize + fileListSize;

    if (totalSize <= this.maxFilesSize) {
      if (currentAttachmentsArr.length + fileList.length <= this.maxFilesNumber) {
        fileList?.forEach((file: File) => {
          const reader = new FileReader();
          reader.onload = this._handleReaderLoaded(file);
          reader.readAsDataURL(file as any);
        });
      }
      else {
        this._notificationsService.error(`Вложений не должно быть больше ${this.maxFilesNumber}`);
      }
    } else {
      this._notificationsService.error(`Суммарный размер вложений не может быть более 5Мб`);
    }

  }

  private _handleReaderLoaded(file: File): any {
    return (e) => {
      const attachmentsList = this.form.get('attachments') as FormArray;
      if ((file.name?.length <= 100)) {
        attachmentsList.push(this._createAttachmentItem({ name: file.name, title: file.name, content: e.target.result }));
      } else {
        this._notificationsService.error('Длина имени файла должна быть до 100 символов');
      }
    }
  }

  disabledDateCollectingFrom(current: Date): boolean {
    return differenceInCalendarDays(current, new Date()) < 0;
  }

  disabledDateCollectingTo(current: Date): boolean {
    return differenceInCalendarDays(current, new Date(this.form.get('dateCollectingFrom').value)) < 1;
  }

  disabledDateConsideringTo(current: Date): boolean {
    return differenceInCalendarDays(current, new Date(this.form.get('dateCollectingTo').value)) < 1;
  }

  disabledPurchaseConditionsDateDesiredDeliveryTo(current: Date): boolean {
    return differenceInCalendarDays(current, new Date(this.form.get('dateConsideringTo').value)) < 1;
  }

  openModalAddBarcode(currentBarCodesList: { value: string }[], i: number) {
    const modal = this._modalService.create({
      nzTitle: 'Введите штрих-код',
      nzContent: BarcodeFormComponent,
      nzFooter: null,
      nzWidth: 400,
    });

    modal.componentInstance.barCodeChange
      .pipe(take(1))
      .subscribe((res) => {
        const barCodesArr = this.positions.at(i).get('productCustomerSpecificationBarCodes') as FormArray;
        barCodesArr.push(this._fb.group({
          value: this._fb.control(res, [Validators.maxLength(200)])
        }));
        modal.destroy();
      }, (err) => {
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      });
  }

  addPosition() {
    const pos = this.createPositionItem();
    this.positions.push(pos);
  }

  removePositionByIndex(index: number): void {
    this.positions.removeAt(index);
  }

  updateTreeValidity(group: FormGroup | FormArray): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.controls[key];

      if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
        this.updateTreeValidity(abstractControl);
      } else {
        abstractControl.updateValueAndValidity();
      }
    });
  }

  private scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this._el.nativeElement.querySelector(
      'form .ng-invalid'
    );

    if (firstInvalidControl) {
      window.scroll({
        top: this._getTopOffset(firstInvalidControl),
        left: 0,
        behavior: 'smooth'
      });

      fromEvent(window, 'scroll')
        .pipe(
          debounceTime(100),
          take(1)
        )
        .subscribe(() => firstInvalidControl.focus());
    }
  }

  private _getTopOffset(controlEl: HTMLElement): number {
    const labelOffset = 50;
    return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
  }

  save(): void {
    this.form.markAllAsTouched();
    this.updateTreeValidity(this.form);
    this.scrollToFirstInvalidControl();

    if (this.form.valid) {

      const data = this._createRfpData(this.form);
      const idempotencyKey = uuidv4();

      if (this.type === 'RFP_EDIT') {
        this._rfpsService.updateUserRfpById(this.form.get('id').value, data, idempotencyKey)
          .subscribe(() => {
            this._notificationsService.info(`Запрос отредактирован`);
            this._router.navigateByUrl(`/my/rfps`);
          }, (err) => {
            if (err.error?.status === 422 && err.error?.validationError?.length) {
              const validationErrorMessage =  err.validationError[0].message;
              this._notificationsService.error(`Произошла ошибка при редактировании запроса. ${validationErrorMessage}`);
            } else {
              this._notificationsService.error(`Произошла ошибка при редактировании запроса. Попробуйте еще раз.`);
            }
          });
        return;
      }

      this._rfpsService.createUserRfp(data, idempotencyKey)
        .subscribe(() => {
          this._notificationsService.info(`Запрос создан`);
          this._router.navigateByUrl(`/my/rfps`);
        }, (err: any) => {
          if (err.error?.status === 422 && err.error?.validationError?.length) {
            const validationErrorMessage =  err.error.validationError[0].message;
            this._notificationsService.error(`Произошла ошибка при создании запроса. ${validationErrorMessage}`);
          } else {
            this._notificationsService.error(`Произошла ошибка при создании запроса. Попробуйте еще раз.`);
          }
        });

    }
  }

  private _createRfpData(form: FormGroup) {
    const audience = {} as any;
    let attachments = [];
    let positions = [];
    const customerPartyId = form.get('selectedOrganization').value.organizationId;
    const contacts = {
      ...(form.get('contactName').value && { contactName: form.get('contactName').value }),
      ...(form.get('contactPhone').value && { phone: form.get('contactPhone').value }),
      ...(form.get('contactEmail').value && { email: form.get('contactEmail').value }),
    };
    if (form.get('audienceRestrictionType').value) {
      audience.restrictionType = form.get('audienceRestrictionType').value;
      audience.parties = [];
      form.get('audienceParties').value.forEach((party) => {
        audience.parties.push({ inn: party.inn, kpp: party.kpp || 0});
      })
    }
    if (form.get('attachments').value?.length) {
      attachments = form.get('attachments').value;
    }
    if (form.get('positions').value?.length) {
      positions = form.get('positions').value.map((p) => {
        return {
          ...(p.positionCorrelationId && { positionCorrelationId: p.positionCorrelationId }),
          product: {
            customerSpecification: {
              ref1CnCategory: {
                categoryId: '6341'
              },
              productName: p.productCustomerSpecificationProductName,
              // tslint:disable-next-line:max-line-length
              ...(p.productCustomerSpecificationProductDescription && { productDescription: p.productCustomerSpecificationProductDescription }),
              ...(p.productCustomerSpecificationPartNumber && { partNumber: p.productCustomerSpecificationPartNumber }),
              // tslint:disable-next-line:max-line-length
              ...(p.productCustomerSpecificationBarCodes?.length && { barCodes: p.productCustomerSpecificationBarCodes.map((b) => b.value) }),
              baseUnitOkeiCode: '796'
            }
          },
          purchaseConditions: {
            ...(p.purchaseConditionsMaxPrice && { maxPrice: p.purchaseConditionsMaxPrice }),
            ...(p.purchaseConditionsNumberOfPackages && { numberOfPackages: p.purchaseConditionsNumberOfPackages }),
            // tslint:disable-next-line:max-line-length
            ...(p.purchaseConditionsDateDesiredDeliveryTo && { dateDesiredDeliveryTo: format(new Date(p.purchaseConditionsDateDesiredDeliveryTo), 'yyyy-MM-dd') }),
            packaging: {
              unitsNumerator: 1,
              unitsDenominator: 1
            },
          }
        }
      });
    }

    const data = {
      proposalRequirements: {
        customerPartyId,
        contacts,
        positions,
        termsAndConditions: {
          currencyCode: '643',
          dateCollectingFrom: format(new Date(this.form.get('dateCollectingFrom').value), 'yyyy-MM-dd'),
          dateCollectingTo: format(new Date(this.form.get('dateCollectingTo').value), 'yyyy-MM-dd'),
          dateConsideringTo: format(new Date(this.form.get('dateConsideringTo').value), 'yyyy-MM-dd'),
          // tslint:disable-next-line:max-line-length
          ...((form.get('deliveryRegion').value && typeof form.get('deliveryRegion').value === 'object' && form.get('deliveryRegion').value !== null) && {
              deliveryRegion: {
                countryCode: CountryCode.RUSSIA,
                fiasRegionCode: form.get('deliveryRegion').value.fias,
              }
          }),
          // tslint:disable-next-line:max-line-length
          ...((form.get('deliveryRegion').value && typeof form.get('deliveryRegion').value === 'string' && this.deliveryRegion && this.deliveryRegion.locality.toLowerCase() === form.get('deliveryRegion').value.toLowerCase()) && {
            deliveryRegion: {
              countryCode: CountryCode.RUSSIA,
              fiasRegionCode: this.deliveryRegion.fias,
            }
          }),
          ...((form.get('deliveryRegion').value && typeof form.get('deliveryRegion').value === 'string' && !this.deliveryRegion) && {
            deliveryDescription: form.get('deliveryRegion').value
          }),
          // tslint:disable-next-line:max-line-length
          ...((form.get('deliveryRegion').value && typeof form.get('deliveryRegion').value === 'string' && this.deliveryRegion && this.deliveryRegion.locality.toLowerCase() !== form.get('deliveryRegion').value.toLowerCase()) && {
            deliveryDescription: form.get('deliveryRegion').value
          }),
        }
      },
      ...(form.get('documentOrderNumber').value && { documentOrderNumber: form.get('documentOrderNumber').value }),
      ...(audience.restrictionType && { audience }),
      ...(attachments.length && { attachments }),
    };

    return data;
  }

}

