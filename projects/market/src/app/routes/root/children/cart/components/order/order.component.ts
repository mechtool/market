import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  CartDataOrderResponseModel,
  CartDataResponseModel,
  CountryCode,
  DeliveryMethod,
  Level,
  LocationModel,
  MetrikaEventOrderFailParametrizedEnumModel,
  MetrikaEventOrderFailParametrizedModel,
  MetrikaEventOrderTryParametrizedModel,
  MetrikaEventTypeModel,
  RelationEnumModel,
  UserOrganizationModel,
} from '#shared/modules/common-services/models';
import { switchMap, tap } from 'rxjs/operators';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import format from 'date-fns/format';
import { absoluteImagePath, currencyCode, innKppToLegalId, uniqueArray, unsubscribeList } from '#shared/utils';
import { combineLatest, of, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {
  BNetService,
  CartService,
  ExternalProvidersService,
  LocationService,
  NavigationService,
  NotificationsService,
  TradeOffersService,
  UserService,
} from '#shared/modules/common-services';
import { DeliveryMethodModel } from './models';
import { UserInfoModel } from '#shared/modules/common-services/models/user-info.model';
import { AuthModalService } from '#shared/modules/setup-services/auth-modal.service';
import { CartModalService } from '../../cart-modal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { notBlankValidator } from '#shared/utils/common-validators';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { SearchCounterpartyComponent } from '#shared/modules/components/search-counterparty';

const VATS = {
  VAT_10: 10,
  VAT_20: 20,
  VAT_WITHOUT: 0,
};

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-cart-order',
  templateUrl: './order.component.html',
  styleUrls: [
    './order.component.scss',
    './order.component-1380.scss',
    './order.component-992.scss',
    './order.component-768.scss',
    './order.component-576.scss',
    './order.component-400.scss',
    './order.component-360.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartOrderComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('elementInputCity') elementInputCity: ElementRef;
  @ViewChild('elementInputStreet') elementInputStreet: ElementRef;
  @ViewChild('elementInputHouse') elementInputHouse: ElementRef;
  @ViewChild('elementInputContactEmail') elementInputContactEmail: ElementRef;
  @ViewChild('elementInputContactPhone') elementInputContactPhone: ElementRef;
  @ViewChild('elementInputContactName') elementInputContactName: ElementRef;
  @ViewChild('elementDivConsumerName') elementDivConsumerName: ElementRef;
  @Input() order: CartDataOrderResponseModel;
  @Input() userInfo: UserInfoModel;
  @Output() cartDataChange: EventEmitter<CartDataResponseModel> = new EventEmitter();
  form: FormGroup;
  isOrderLoading = false;
  deliveryMethods: DeliveryMethodModel[] = null;
  selectedTabIndex = 0;
  selectedCity: LocationModel;
  selectedStreet: LocationModel;
  selectedHouse: LocationModel;
  foundCities: string[];
  foundStreets: string[];
  foundHouses: string[];
  minDate = new Date();
  enteredCustomerData: any;
  private _foundLocations: LocationModel[];
  private _validDeliveryFiasCode: string[];
  private _cartDataSubscription: Subscription;
  private _offerWithRegistration = true;

  get unavailableToOrder(): boolean {
    const unavailableToOrderStatuses = ['TemporarilyOutOfSales', 'NoOfferAvailable'];
    return this.order.makeOrderViolations?.some((x) => unavailableToOrderStatuses.includes(x.code));
  }

  get minOrderAmountViolations(): any {
    return this.order.makeOrderViolations?.find((x) => 'SupplierPolicyViolated' === x.code && !x.tradeOfferId);
  }

  get consumerName(): string {
    return this.form.value.consumerName?.trim();
  }

  get consumerINN(): string {
    return this.form.value.consumerINN;
  }

  get supplierName(): string {
    return this.order.supplier?.name?.trim();
  }

  get supplierINN(): string {
    return this.order.supplier?.inn;
  }

  get total(): number {
    return +this.form.value.total;
  }

  get totalVat(): number {
    return +this.form.value.totalVat;
  }

  get deliveryMethod(): string {
    return this.form.value.deliveryMethod?.trim();
  }

  get pickupArea(): any {
    return this.form.value.pickupArea;
  }

  get pickupPoints(): any[] {
    return this.order.deliveryOptions?.pickupPoints;
  }

  get deliveryZones(): any[] {
    return this.order.deliveryOptions?.deliveryZones;
  }

  get selectedDelivery(): boolean {
    return this.deliveryMethod === DeliveryMethod.DELIVERY;
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  get itemsControls(): FormGroup[] {
    return this.items.controls as FormGroup[];
  }

  get noDeliveryAddressSelected(): boolean {
    return !this.selectedCity && this.selectedDelivery;
  }

  get isNotFilledCustomerData(): boolean {
    return this.isRegisterAndMakeOrderOrRegisterAndRequestForPrice && !this.enteredCustomerData;
  }

  get isAnonymous(): boolean {
    return !this.userInfo;
  }

  get isAuthenticated(): boolean {
    return !!this.userInfo;
  }

  get isOrderType(): boolean {
    // todo пересмотреть места использования в пользу конкретного типа ссылки
    return this.order.tags?.includes('Order');
  }

  get unavailableItemsInOder(): boolean {
    return this.isAuthenticated && !this.isMakeOrderOrRequestForPrice && !this.isRegisterAndMakeOrderOrRegisterAndRequestForPrice;
  }

  get isMakeOrderOrRequestForPrice(): boolean {
    return !!(this.makeOrderLinkOrRequestForPriceLink)
  }

  get makeOrderLinkOrRequestForPriceLink(): string {
    return this.makeOrderLink || this.requestForPriceLink
  }

  get isRegisterAndMakeOrderOrRegisterAndRequestForPrice(): boolean {
    return !!(this.registerAndMakeOrderLinkOrRegisterAndRequestForPriceLink);
  }

  get registerAndMakeOrderLinkOrRegisterAndRequestForPriceLink(): string {
    return this.registerAndMakeOrderLink || this.registerAndRequestForPriceLink
  }

  get abilityMakeOrderOrRequestForPrice(): boolean {
    return this.isAuthenticated && this.hasAvailableOrganizations && !!(this.makeOrderLinkOrRequestForPriceLink);
  }

  get abilityRegisterMakeOrderOrRegisterRequestForPrice(): boolean {
    return this.subjAnonymousOrAuthenticatedWithoutOrganizations && this.isRegisterAndMakeOrderOrRegisterAndRequestForPrice;
  }

  get subjAnonymousOrAuthenticatedWithoutOrganizations(): boolean {
    return this.isAnonymous || (this.isAuthenticated && !this.hasAvailableOrganizations);
  }

  get subjAnonymousOrAuthenticatedWithoutOrgsAndOfferWithRegistration(): boolean {
    return this.subjAnonymousOrAuthenticatedWithoutOrganizations && this._offerWithRegistration;
  }

  get subjAuthenticatedWithoutOrgsAndOfferWithRegistration(): boolean {
    return (this.isAuthenticated && !this.hasAvailableOrganizations) && this._offerWithRegistration;
  }

  get subjAnonymousAndOfferWithRegistration(): boolean {
    return this.isAnonymous && this._offerWithRegistration;
  }

  get hasAvailableOrganizations(): boolean {
    return !!this.availableOrganizations?.length
  }

  get isNotValidOrderForm() {
    return this.form.invalid || this.noDeliveryAddressSelected || this.isNotFilledCustomerData;
  }


  get availableOrganizations(): UserOrganizationModel[] {
    if (this.order.customersAudience?.length) {
      return this._userService.organizations$.getValue()
        .filter((org) => {
          const legalId = innKppToLegalId(org.legalRequisites.inn, org.legalRequisites.kpp);
          return this.order?.customersAudience.some((aud) => aud.legalId === legalId);
        });
    }
    return this._userService.organizations$.getValue();
  }


  get makeOrderLink(): string {
    return this.order._links?.[RelationEnumModel.MAKE_ORDER]?.href
  }

  get requestForPriceLink(): string {
    return this.order._links?.[RelationEnumModel.REQUEST_FOR_PRICE]?.href
  }

  get registerAndMakeOrderLink(): string {
    return this.order._links?.[RelationEnumModel.REGISTER_AND_MAKE_ORDER]?.href
  }

  get registerAndRequestForPriceLink(): string {
    return this.order._links?.[RelationEnumModel.REGISTER_AND_REQUEST_FOR_PRICE]?.href
  }

  get isHistoryAvailable() {
    return this._navigationService.history.length > 1;
  }

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _bnetService: BNetService,
    private _cartService: CartService,
    private _userService: UserService,
    private _modalService: NzModalService,
    private _locationService: LocationService,
    private _authModalService: AuthModalService,
    private _cartModalService: CartModalService,
    private _navigationService: NavigationService,
    private _tradeOffersService: TradeOffersService,
    private _notificationsService: NotificationsService,
    private _externalProvidersService: ExternalProvidersService,
  ) {
  }

  ngOnInit() {
    const tag = {
      event: 'BasketPage',
      currencyCode: this.order?.orderTotal?.currencyCode ? currencyCode(this.order?.orderTotal?.currencyCode) : 'RUB',
      value: this.order?.orderTotal?.total ? this.order.orderTotal.total / 100 : '',
      products_info: this.order.items?.map((item) => {
        return {
          id: item.tradeOfferId || '',
          price: item.price ? item.price / 100 : '',
          quantity: item.quantity || '',
        };
      }),
    };
    this._externalProvidersService.fireGTMEvent(tag);

    this._cartDataSubscription = this._cartService.getCartData$().pipe(
      tap(() => {
        this._initDeliveryMethods();
        this._initForm();
      }),
      tap(() => {
        if (this.abilityMakeOrderOrRequestForPrice) {
          this.setConsumer(this.availableOrganizations[0]);
        }
      }),
      tap(() => {
        this._initValidDeliveryFiasCode();
      }),
      switchMap(() => {

        if (this.isAuthenticated) {
          const userLocation = this._locationService.getSelectedCustomLocation();

          if (userLocation) {

            if (this._deliveryByRussia()) {
              return combineLatest([of(true), of(userLocation)])
            }

            return combineLatest(
              [this._locationService.isDeliveryAvailable(userLocation.fias, this._validDeliveryFiasCode), of(userLocation)]);
          }
        }
        return combineLatest([of(false), of(null)]);
      }),
      tap(() => {
        this._watchDeliveryAreaUserChanges();
      }),
      tap(([isAvailable, userLocation]) => {
        if (isAvailable) {
          this.form.get('deliveryArea.deliveryCity').setValue(userLocation.locality, {
            onlySelf: true,
            emitEvent: true
          });
          this._saveCityAndEnableStreetAndHouse(userLocation);
        }
      })
    ).subscribe(() => {
      this._watchItemQuantityChanges();
    });
  }

  ngOnDestroy() {
    unsubscribeList([this._cartDataSubscription]);
  }

  ngAfterViewInit() {
    dispatchEvent(new CustomEvent('scroll'));
  }

  validateAndSubmitOrder() {

    this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.TRY_ORDER);
    this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.ORDER_TRY_PARAMETRIZED, {
      ...(this.isMakeOrderOrRequestForPrice && {
        params: {
          [MetrikaEventOrderTryParametrizedModel.title]: {
            [MetrikaEventOrderTryParametrizedModel.orderLink]: this.makeOrderLinkOrRequestForPriceLink,
          },
        },
      }),
      ...(this.isRegisterAndMakeOrderOrRegisterAndRequestForPrice && {
        params: {
          [MetrikaEventOrderTryParametrizedModel.title]: {
            [MetrikaEventOrderTryParametrizedModel.orderLink]: this.registerAndMakeOrderLinkOrRegisterAndRequestForPriceLink,
          },
        },
      }),
    });

    if (this.subjAnonymousAndOfferWithRegistration) {
      const modal = this._authModalService.openAuthOrOrderDecisionMakerModal(this.isOrderType);
      this._changeSelectedTabAndDestroyModal(modal);

      this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.ORDER_FAIL_PARAMETRIZED, {
        params: {
          [MetrikaEventOrderFailParametrizedModel.title]: {
            [MetrikaEventOrderFailParametrizedModel.reasonTitle]: MetrikaEventOrderFailParametrizedEnumModel.NOT_AUTHED,
            ...(this.isRegisterAndMakeOrderOrRegisterAndRequestForPrice && {
              [MetrikaEventOrderFailParametrizedModel.orderLink]: this.registerAndMakeOrderLinkOrRegisterAndRequestForPriceLink
            }),
          },
        },
      });
      return;
    }

    if (this.subjAuthenticatedWithoutOrgsAndOfferWithRegistration) {
      const modal = this._authModalService.openAddOrgOrOrderDecisionMakerModal(this.isOrderType);
      this._changeSelectedTabAndDestroyModal(modal);

      this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.ORDER_FAIL_PARAMETRIZED, {
        params: {
          [MetrikaEventOrderFailParametrizedModel.title]: {
            [MetrikaEventOrderFailParametrizedModel.reasonTitle]: MetrikaEventOrderFailParametrizedEnumModel.NO_ORGANIZATIONS,
            ...(this.isRegisterAndMakeOrderOrRegisterAndRequestForPrice && {
              [MetrikaEventOrderFailParametrizedModel.orderLink]: this.registerAndMakeOrderLinkOrRegisterAndRequestForPriceLink
            }),
          },
        },
      });
      return;
    }

    if (this.unavailableItemsInOder) {
      // todo Кажется что этот сценарий больше не может воспроизвестись, так как кнопка отправки заказа задизаблена при таком сценарии
      // todo Перепроверить, в случае необходимости удалить
      this.changeSelectedTabIndex(0);
      this._cartModalService.openOrderUnavailableModal();
      this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.ORDER_FAIL_PARAMETRIZED, {
        params: {
          [MetrikaEventOrderFailParametrizedModel.title]: {
            [MetrikaEventOrderFailParametrizedModel.reasonTitle]: MetrikaEventOrderFailParametrizedEnumModel.NO_LINK,
          },
        },
      });
      return;
    }

    if (this.isNotValidOrderForm) {
      if (this.selectedTabIndex === 0) {
        this.changeSelectedTabIndex(1);
        return;
      }
      if (this.selectedTabIndex === 1) {
        Object.keys(this.form.controls).forEach((key) => {
          this.form.controls[key].markAsTouched();
        });

        if (this.form.invalid) {
          if (this.form.controls.contactEmail.invalid) {
            this.elementInputContactEmail?.nativeElement.focus();
          }

          if (this.form.controls.contactPhone.invalid) {
            this.elementInputContactPhone?.nativeElement.focus();
          }

          if (this.form.controls.contactName.invalid) {
            this.elementInputContactName?.nativeElement.focus();
          }
        }

        if (this.noDeliveryAddressSelected) {
          this.form.controls.deliveryArea.setErrors({ deliveryAreaCondition: true }, { emitEvent: true });
          this.elementInputCity?.nativeElement.focus();
        }

        if (this.isNotFilledCustomerData) {
          this.elementDivConsumerName?.nativeElement.scrollIntoView({ block: 'center', inline: 'nearest' });
        }
      }

      this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.ORDER_FAIL_PARAMETRIZED, {
        params: {
          [MetrikaEventOrderFailParametrizedModel.title]: {
            [MetrikaEventOrderFailParametrizedModel.reasonTitle]: MetrikaEventOrderFailParametrizedEnumModel.FIELDS_NOT_VALID,
            ...(this.isMakeOrderOrRequestForPrice && {
              [MetrikaEventOrderFailParametrizedModel.orderLink]: this.makeOrderLinkOrRequestForPriceLink
            }),
            ...(this.isRegisterAndMakeOrderOrRegisterAndRequestForPrice && {
              [MetrikaEventOrderFailParametrizedModel.orderLink]: this.registerAndMakeOrderLinkOrRegisterAndRequestForPriceLink
            }),
          },
        },
      });
      return;
    }

    if (this.isMakeOrderOrRequestForPrice) {
      this._executeMakeOrderOrRequestForPrice();
    }

    if (this.isRegisterAndMakeOrderOrRegisterAndRequestForPrice) {
      this._executeRegisterAndMakeOrderOrRegisterAndRequestForPrice();
    }
  }

  navigationBack() {
    this._navigationService.back();
  }

  setPickupArea(pickupPoint) {
    this.form.patchValue({
      pickupArea: pickupPoint,
    });
  }

  currentDateFormat(date, format: string = 'yyyy-MM-dd HH:mm'): any {
    if (date) {
      const pad = (n: number): string => (n < 10 ? `0${n}` : n.toString());
      return format
        .replace('yyyy', date.getFullYear())
        .replace('MM', pad(date.getMonth() + 1))
        .replace('dd', pad(date.getDate()))
        .replace('HH', pad(date.getHours()))
        .replace('mm', pad(date.getMinutes()))
        .replace('ss', pad(date.getSeconds()));
    }
  }

  removeItem(orderItem: any) {
    if (this.isOrderLoading) {
      return;
    }
    this.isOrderLoading = true;
    this._cartService
      .handleRelation(RelationEnumModel.ITEM_REMOVE, orderItem._links.value[RelationEnumModel.ITEM_REMOVE].href)
      .pipe(
        tap(() => {
          const tag = {
            event: 'removeFromCart',
            ecommerce: {
              remove: {
                products: [
                  {
                    name: orderItem?.productName?.value || '',
                    id: orderItem?.tradeOfferId?.value || '',
                    price: orderItem?.price?.value ? orderItem.price.value / 100 : '',
                    brand: '',
                    category: '',
                    variant: this.order?.supplier?.name || '',
                    quantity: orderItem?.quantity?.value || '',
                  },
                ],
              },
            },
          };
          this._externalProvidersService.fireGTMEvent(tag);
        }),
        tap(() => {
          this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.ORDER_PUT);
        }),
        switchMap(() => {
          return this._cartService.setActualCartData();
        }),
      ).subscribe((carData) => {
        this.cartDataChange.emit(carData);
      },
      (err) => {
        this.isOrderLoading = false;
        this._cdr.detectChanges();
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      },
    );
  }

  changeSelectedTabIndex(tabIndex: number) {
    this.selectedTabIndex = tabIndex;

    if (tabIndex === 1) {
      const tag = {
        event: 'checkout',
        ecommerce: {
          currencyCode: this.order?.orderTotal?.currencyCode ? currencyCode(this.order?.orderTotal?.currencyCode) : 'RUB',
          value: this.order?.orderTotal?.total ? this.order.orderTotal.total / 100 : '',
          checkout: {
            actionField: { step: 1, option: 'checkout' },
            products: this.order.items?.map((item) => {
              return {
                name: item.productName || '',
                id: item.tradeOfferId || '',
                price: item.price ? item.price / 100 : '',
                brand: '',
                category: '',
                variant: this.order?.supplier?.name || '',
                quantity: item.quantity || '',
              };
            }),
          },
        },
      };
      this._externalProvidersService.fireGTMEvent(tag);
    }
  }

  setConsumer(userOrganization: any): void {
    this.form.patchValue({
      consumerName: userOrganization.organizationName,
      consumerINN: userOrganization.legalRequisites.inn,
      consumerKPP: userOrganization.legalRequisites.kpp,
      consumerId: userOrganization.organizationId,
    });
  }

  goToTradeOffer(tradeOfferId: string) {
    if (tradeOfferId) {
      this._tradeOffersService.get(tradeOfferId).subscribe(
        (tradeOffer) => {
          const supplierId = tradeOffer.supplier?.bnetInternalId;
          this._router.navigate([`./supplier/${supplierId}/offer/${tradeOfferId}`]);
        },
        (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this._notificationsService.error('Данный товар недоступен к просмотру');
          } else {
            this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
          }
        },
      );
    }
  }

  disabledDate(current: Date): boolean {
    return differenceInCalendarDays(current, new Date()) < 1;
  }

  citySelected() {
    const city = this.form.value.deliveryArea.deliveryCity;
    const location = this._foundLocations.find((loc) => loc.locality === city);
    this.selectedStreet = null;
    this.selectedHouse = null;

    if (location) {
      if (this._deliveryByRussia()) {
        this._saveCityAndEnableStreetAndHouse(location);
      } else {
        this._locationService.isDeliveryAvailable(location.fias, this._validDeliveryFiasCode).subscribe((isAvailable) => {
          if (isAvailable) {
            this._saveCityAndEnableStreetAndHouse(location);
          } else {
            this._selectedCityIsNotAvailable();
          }
        });
      }
    } else {
      this._selectedCityIsNotAvailable();
    }
  }

  streetSelected() {
    const street = this.form.value.deliveryArea.deliveryStreet;
    const location = this._foundLocations.find((loc) => loc.street === street);
    this.selectedHouse = null;

    if (location) {
      if (this._deliveryByRussia()) {
        this._saveStreet(location);
      } else {
        this._locationService.isDeliveryAvailable(location.fias, this._validDeliveryFiasCode).subscribe((isAvailable) => {
          if (isAvailable) {
            this._saveStreet(location);
          } else {
            this.elementInputHouse?.nativeElement.focus();
          }
        });
      }
    } else {
      this.elementInputHouse?.nativeElement.focus();
    }
  }

  houseSelected() {
    const house = this.form.value.deliveryArea.deliveryHouse;
    const location = this._foundLocations.find((loc) => loc.house === house);

    if (location) {
      if (this._deliveryByRussia()) {
        this.selectedHouse = location;
      } else {
        this._locationService.isDeliveryAvailable(location.fias, this._validDeliveryFiasCode).subscribe((isAvailable) => {
          if (isAvailable) {
            this.selectedHouse = location;
          }
        });
      }
    }
    this.elementInputHouse?.nativeElement.blur();
  }

  openSearchCounterpartyModal() {
    const modal = this._modalService.create({
      nzContent: SearchCounterpartyComponent,
      nzFooter: null,
      nzWidth: 480,
      nzComponentParams: {},
    });

    modal.componentInstance.counterpartyRequisitesChange
      .subscribe((res) => {
        this.enteredCustomerData = res;
        modal.destroy();
        this._cdr.detectChanges();
      });
  }

  private _saveCityAndEnableStreetAndHouse(location: LocationModel): void {
    this.selectedCity = location;
    this.form.get('deliveryArea.deliveryStreet').enable({ onlySelf: true, emitEvent: false });
    this.form.get('deliveryArea.deliveryHouse').enable({ onlySelf: true, emitEvent: false });
    this.elementInputStreet?.nativeElement.focus();
  }

  private _selectedCityIsNotAvailable(): void {
    this.form.controls.deliveryArea.setErrors({ selectedCityIsNotAvailable: true }, { emitEvent: true });
    this.elementInputCity?.nativeElement.blur();
  }

  private _saveStreet(location: LocationModel): void {
    this.selectedStreet = location;
    this.elementInputHouse?.nativeElement.focus();

    // todo возможно это событие следует перенести, так как теперь улица опциональное для ввода поле
    const tag = {
      event: 'login',
      ecommerce: {
        checkout_option: {
          actionField: { step: 2, option: 'delivery' },
        },
      },
    };
    this._externalProvidersService.fireGTMEvent(tag);
  }

  private _watchDeliveryAreaUserChanges() {
    this.form.get('deliveryArea.deliveryCity').valueChanges
      .pipe(
        switchMap((city) => {
          if (city?.length > 1) {
            this.form.get('deliveryArea.deliveryHouse').setValue('', { onlySelf: true, emitEvent: false });
            this.form.get('deliveryArea.deliveryHouse').disable({ onlySelf: true, emitEvent: false });
            this.form.get('deliveryArea.deliveryStreet').setValue('', { onlySelf: true, emitEvent: false });
            this.form.get('deliveryArea.deliveryStreet').disable({ onlySelf: true, emitEvent: false });
            return this._locationService.searchAddresses({ deliveryCity: city }, Level.CITY);
          }
          return of([]);
        }),
      ).subscribe((cities) => {
        this.foundStreets = [];
        this.foundHouses = [];
        this._foundLocations = cities;
        this.foundCities = cities.map((city) => city.locality).filter(uniqueArray);
        this._cdr.detectChanges();
      },
      (err) => {
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      },
    );

    this.form.get('deliveryArea.deliveryStreet').valueChanges
      .pipe(
        switchMap((street) => {
          if (street?.length) {
            this.form.get('deliveryArea.deliveryHouse').setValue('', { onlySelf: true, emitEvent: false });
            const query = {
              deliveryCity: this.form.value.deliveryArea.deliveryCity,
              deliveryStreet: street,
            };
            return this._locationService.searchAddresses(query, Level.STREET);
          }
          return of([]);
        }),
      ).subscribe((cities) => {
        this.foundHouses = [];
        this._foundLocations = cities;
        this.foundStreets = cities.map((city) => city.street).filter(uniqueArray);
        this._cdr.detectChanges();
      },
      (err) => {
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      },
    );

    this.form.get('deliveryArea.deliveryHouse').valueChanges
      .pipe(
        switchMap((house: string) => {
          if (house?.length) {
            if (house.includes('литер')) {
              /* todo сервис https://api.orgaddress.1c.ru не может найти адрес если передать текст в формате 'text=Санкт-Петербург г, Ленина ул, 12/36, литер А'
            при этом 'text=Санкт-Петербург г, Ленина ул, 12/36, литер' успешно находится, поэтому пришлось подоткнуть тут данный костыль*/
              const count = house.indexOf('литер') + 5;
              house = house.substr(0, count);
            }

            const query = {
              deliveryCity: this.form.value.deliveryArea.deliveryCity,
              deliveryStreet: this.form.value.deliveryArea.deliveryStreet,
              deliveryHouse: house,
            };
            return this._locationService.searchAddresses(query, Level.HOUSE);
          }
          return of([]);
        }),
      ).subscribe((cities) => {
        this.foundHouses = cities.map((city) => city.house).filter(uniqueArray);
        this._foundLocations = cities;
        this._cdr.detectChanges();
      },
      (err) => {
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      },
    );
  }

  private _initValidDeliveryFiasCode(): void {
    this._validDeliveryFiasCode =
      this.order.deliveryOptions?.deliveryZones?.filter((zone) => zone.fiasCode || zone.countryOksmCode === CountryCode.RUSSIA)
        .map((zone) => !zone.fiasCode ? zone.countryOksmCode : zone.fiasCode)
      || [];
  }

  private _deliveryByRussia(): boolean {
    return !this._validDeliveryFiasCode?.length || this._validDeliveryFiasCode.some((code) => code === CountryCode.RUSSIA);
  }

  private _watchItemQuantityChanges() {
    this.itemsControls?.forEach((item) => {
      const quantityControl = item.controls.quantity;
      quantityControl.valueChanges
        .pipe(
          tap((_) => (this.isOrderLoading = true)),
          tap((_) => {
            this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.ORDER_PUT);
          }),
          switchMap((orderQuantity) => {
            if (orderQuantity < item.value.orderQtyMin) {
              return this._cartService
                .handleRelation(RelationEnumModel.ITEM_REMOVE, item.value['_links'][RelationEnumModel.ITEM_REMOVE].href)
                .pipe(
                  tap(() => {
                    const tag = {
                      event: 'removeFromCart',
                      ecommerce: {
                        remove: {
                          products: [
                            {
                              name: item.value.productName || '',
                              id: item.value.tradeOfferId || '',
                              price: item.value.price ? item.value.price / 100 : '',
                              brand: '',
                              category: '',
                              variant: this.order?.supplier?.name || '',
                              quantity: item.value?.quantity || '',
                            },
                          ],
                        },
                      },
                    };
                    this._externalProvidersService.fireGTMEvent(tag);
                  }),
                );
            }

            if (orderQuantity % item.value.orderQtyStep !== 0) {
              orderQuantity = orderQuantity - (orderQuantity % item.value.orderQtyStep);
            }

            return this._cartService.handleRelation(
              RelationEnumModel.ITEM_UPDATE_QUANTITY,
              item.value['_links'][RelationEnumModel.ITEM_UPDATE_QUANTITY].href,
              {
                quantity: orderQuantity,
              },
            );
          }),
          switchMap(() => {
            return this._cartService.setActualCartData();
          }),
        ).subscribe((cartData) => {
          this.cartDataChange.emit(cartData);
        },
        (err) => {
          this.isOrderLoading = false;
          this._cdr.detectChanges();
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );
    });
  }

  private _executeMakeOrderOrRequestForPrice() {
    const relationType = this.isOrderType ? RelationEnumModel.MAKE_ORDER : RelationEnumModel.REQUEST_FOR_PRICE;
    this._send(relationType, this.makeOrderLinkOrRequestForPriceLink, this._createOrderData());
  }

  private _executeRegisterAndMakeOrderOrRegisterAndRequestForPrice() {
    const relationType = this.isOrderType ? RelationEnumModel.REGISTER_AND_MAKE_ORDER : RelationEnumModel.REGISTER_AND_REQUEST_FOR_PRICE;
    this._send(relationType, this.registerAndMakeOrderLinkOrRegisterAndRequestForPriceLink, this._createRegisterOrderData());
  }

  private _send(relationType: RelationEnumModel, relationHref: string, orderData: any) {
    this._cartService
      .handleRelation(relationType, relationHref, orderData)
      .pipe(
        switchMap((_) => this._cartService.setActualCartData()),
        tap(() => {
          const tag = {
            event: 'transactionDL',
            ecommerce: {
              currencyCode: this.order?.orderTotal?.currencyCode ? currencyCode(this.order?.orderTotal?.currencyCode) : 'RUB',
              purchase: {
                actionField: {
                  id: Math.random(),
                  revenue: this.order?.orderTotal?.total ? this.order.orderTotal.total / 100 : '',
                },
                products: this.order.items?.map((item) => {
                  return {
                    name: item.productName || '',
                    id: item.tradeOfferId || '',
                    price: item.price ? item.price / 100 : '',
                    brand: '',
                    category: '',
                    variant: this.order?.supplier?.name || '',
                    dimension1: '',
                    quantity: item.quantity || '',
                  };
                }),
              },
            },
          };
          this._externalProvidersService.fireGTMEvent(tag);
          this._externalProvidersService.fireYandexMetrikaEvent(
            this.isOrderType ? MetrikaEventTypeModel.ORDER_CREATE : MetrikaEventTypeModel.PRICEREQUEST_CREATE,
          );
        }),
      ).subscribe((cartData) => {
        if (this.isMakeOrderOrRequestForPrice) {
          this._cartModalService.openOrderSentModal(this.isOrderType);
        }
        if (this.isRegisterAndMakeOrderOrRegisterAndRequestForPrice) {
          this._cartModalService.openRegisterAndOrderSentModal(this.isOrderType, this.isAnonymous);
        }
        this.cartDataChange.emit(cartData);
      },
      (err) => {
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      },
    );
  }

  private _createRegisterOrderData() {
    const comment = this._orderComment();

    return {
      customerOrganization: {
        name: this.enteredCustomerData.name,
        inn: this.enteredCustomerData.inn,
        ...(this.enteredCustomerData.kpp && { kpp: this.enteredCustomerData.kpp })
      },
      contacts: {
        name: this.form.value.contactName,
        phone: `+7${this.form.value.contactPhone}`,
        email: this.form.value.contactEmail,
      },
      ...(comment && { comment }),
      deliveryOptions: {
        ...(this.selectedDelivery
          ? {
            deliveryTo: this._deliveryTo(),
          }
          : {
            pickupFrom: this.pickupArea,
          }),
      },
    };
  }

  private _createOrderData() {
    const comment = this._orderComment();
    return {
      customerOrganizationId: this.form.value.consumerId,
      contacts: {
        name: this.form.value.contactName,
        phone: `+7${this.form.value.contactPhone}`,
        email: this.form.value.contactEmail,
      },
      ...(comment && { comment }),
      deliveryOptions: {
        ...(this.selectedDelivery
          ? {
            deliveryTo: this._deliveryTo(),
          }
          : {
            pickupFrom: this.pickupArea,
          }),
      },
    };
  }

  private _deliveryTo(): any {
    const delivery = { fiasCode: undefined, title: undefined, countryOksmCode: CountryCode.RUSSIA };

    if (this.selectedHouse) {

      delivery.fiasCode = this.selectedHouse.fias;
      delivery.title = this.selectedHouse.fullName;

    } else if (this.selectedStreet) {
      if (this.form.value.deliveryArea.deliveryHouse) {
        delivery.title = this.selectedStreet.fullName.replace(',', `, дом ${this.form.value.deliveryArea.deliveryHouse},`);
      } else {
        delivery.fiasCode = this.selectedStreet.fias;
        delivery.title = this.selectedStreet.fullName;
      }

    } else {
      if (this.form.value.deliveryArea.deliveryHouse) {
        if (this.form.value.deliveryArea.deliveryStreet) {
          delivery.title = `${this.form.value.deliveryArea.deliveryStreet}, дом ${this.form.value.deliveryArea.deliveryHouse}, ${this.selectedCity.fullName}`;
        } else {
          delivery.title = `дом ${this.form.value.deliveryArea.deliveryHouse}, ${this.selectedCity.fullName}`;
        }
      } else if (this.form.value.deliveryArea.deliveryStreet) {
        delivery.title = `${this.form.value.deliveryArea.deliveryStreet}, ${this.selectedCity.fullName}`;
      } else {
        delivery.fiasCode = this.selectedCity.fias;
        delivery.title = this.selectedCity.fullName;
      }
    }
    return delivery;
  }

  private _orderComment() {
    return `${this.form.value.deliveryDesirableDate ? `Желаемая дата доставки: ${format(new Date(this.form.value.deliveryDesirableDate), 'dd-MM-yyyy HH:mm')}.` : ''}${this.form.value.commentForSupplier ? ` ${this.form.value.commentForSupplier}` : ''}`;
  }

  private _initDeliveryMethods(): void {
    const deliveryOptions = this.order.deliveryOptions;
    this.deliveryMethods = [];

    if (
      !deliveryOptions ||
      (!deliveryOptions.deliveryZones?.length && !deliveryOptions.pickupPoints?.length) ||
      (deliveryOptions.deliveryZones?.length && !deliveryOptions.pickupPoints?.length)
    ) {
      this.deliveryMethods.push(
        { label: 'Доставка', value: DeliveryMethod.DELIVERY, disabled: false },
        { label: 'Самовывоз отсутствует', value: DeliveryMethod.PICKUP, disabled: true },
      );
    } else if (deliveryOptions.pickupPoints?.length && !deliveryOptions.deliveryZones?.length) {
      this.deliveryMethods.push(
        { label: 'Самовывоз', value: DeliveryMethod.PICKUP, disabled: false },
        { label: 'Доставка отсутствует', value: DeliveryMethod.DELIVERY, disabled: true },
      );
    } else if (deliveryOptions.pickupPoints?.length && deliveryOptions.deliveryZones?.length) {
      this.deliveryMethods.push(
        { label: 'Самовывоз', value: DeliveryMethod.PICKUP, disabled: false },
        { label: 'Доставка', value: DeliveryMethod.DELIVERY, disabled: false },
      );
    }
  }

  private _initForm(): void {
    this.form = this._fb.group({
      consumerName: this._fb.control(''),
      consumerINN: this._fb.control(''),
      consumerKPP: this._fb.control(''),
      consumerId: this._fb.control(''),
      total: this._fb.control(this.order.orderTotal?.total),
      totalVat: this._fb.control(this.order.orderTotal?.totalVat),
      deliveryMethod: this._fb.control(this.deliveryMethods[0]?.value, [Validators.required]),
      deliveryArea: this._fb.group(
        {
          deliveryCity: this._fb.control(''),
          deliveryStreet: this._fb.control({ value: '', disabled: true }),
          deliveryHouse: this._fb.control({ value: '', disabled: true }),
        }
      ),
      pickupArea: this._fb.control(this.order.deliveryOptions?.pickupPoints?.[0]),
      contactName: this._fb.control(this.userInfo?.fullName || '',
        [Validators.required, notBlankValidator, Validators.maxLength(200)]),
      contactPhone: this._fb.control(this.userInfo?.phone || '',
        [Validators.required, notBlankValidator, Validators.maxLength(16)]),
      contactEmail: this._fb.control(this.userInfo?.email || '',
        [Validators.required, Validators.email, Validators.maxLength(100)]),
      commentForSupplier: this._fb.control('',
        [notBlankValidator, Validators.maxLength(900)]),
      deliveryDesirableDate: this._fb.control(''),
      items: this._fb.array(this.order.items.map((product) => this._createItem(product))),
    });
  }

  private _createItem(product: any): FormGroup {
    return this._fb.group({
      tradeOfferId: product.tradeOfferId,
      productName: product.productName,
      productDescription: product.productDescription,
      barCodes: this._fb.array(product?.barCodes || []),
      partNumber: product.partNumber,
      packaging: product.packaging,
      imageUrl: this._imageUrl(product.imageUrls),
      quantity: product.quantity,
      price: product.price,
      priceBeforeDiscount: product.priceBeforeDiscount,
      priceIncludesVAT: product.priceIncludesVAT || false,
      maxDaysForShipment: product.maxDaysForShipment,
      orderQtyMin: product.orderQtyMin,
      orderQtyStep: product.orderQtyStep,
      stockAmount: product.stockAmount,
      stockLevel: product.stockLevel,
      nsymb: product.unitOkei?.nsymb,
      warning: this._warnings(product.tradeOfferId),
      availableToOrder: new FormControl(this._availableToOrder(product.tradeOfferId), [Validators.requiredTrue]),
      vat: VATS[product.vat] || 0,
      total: product.itemTotal?.total,
      totalWithoutVat: product.itemTotal?.totalWithoutVat,
      _links: product._links,
    });
  }

  private _warnings(tradeOfferId: string): FormArray {
    const violations =
      this.order.makeOrderViolations?.filter((x) => tradeOfferId === x.tradeOfferId).map((x) => new FormControl(x.message)) || null;
    return violations ? new FormArray(violations) : null;
  }

  private _availableToOrder(tradeOfferId: string): boolean {
    if (!this.order.makeOrderViolations) {
      return true;
    }

    return this.order.makeOrderViolations
      .filter((x) => ['TemporarilyOutOfSales', 'NoOfferAvailable'].includes(x.code))
      .every((x) => x.tradeOfferId !== tradeOfferId);
  }

  private _changeSelectedTabAndDestroyModal(modal: NzModalRef) {
    modal.componentInstance.decisionMakerModalChange.subscribe((isOrderWithoutRegistration) => {
      if (isOrderWithoutRegistration) {
        if (this.selectedTabIndex === 0) {
          this._offerWithRegistration = false;
          this.changeSelectedTabIndex(1);
          this._cdr.detectChanges();
          setTimeout(() => {
            this.elementDivConsumerName?.nativeElement.scrollIntoView({ block: 'center', inline: 'nearest' });
          }, 100)
        }
      }
      modal.destroy(true);
    });
  }

  private _imageUrl(images: string[]): string {
    return images?.length ? absoluteImagePath(images[0]) : './assets/img/svg/clean.svg';
  }
}
