import { Injectable, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  CartDataOrderResponseModel,
  CartDataResponseModel,
  CountryCode,
  DeliveryMethod,
  Level,
  LocationModel,
  Megacity,
  MetrikaEventOrderFailParametrizedEnumModel,
  MetrikaEventOrderFailParametrizedModel,
  MetrikaEventOrderTryParametrizedModel,
  MetrikaEventTypeModel,
  RelationEnumModel,
  UserOrganizationModel
} from '#shared/modules/common-services/models';
import { notBlankValidator } from '#shared/utils/common-validators';
import { DeliveryMethodModel } from './models';
import { UserInfoModel } from '#shared/modules/common-services/models/user-info.model';
import { UserStateService } from '#shared/modules/common-services/user-state.service';
import {
  CartService,
  ExternalProvidersService,
  LocalStorageService,
  LocationService,
  NotificationsService,
  OrganizationsService,
  UserService
} from '#shared/modules/common-services';
import { currencyCode, innKppToLegalId, unsubscribeList } from '#shared/utils';
import { catchError, delay, retry, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { validate as isUuid } from 'uuid';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { CartModalService } from '../../cart-modal.service';
import format from 'date-fns/format';
import {
  innConditionValidator,
  kppConditionValidator,
  kppRequiredIfOrgConditionValidator
} from '#shared/utils/organization-requisite-validators';
import { cityNotDefinedValidator } from './order-validators';

@Injectable()
export class OrderService implements OnDestroy {
  form: FormGroup;

  focus$: BehaviorSubject<string> = new BehaviorSubject(null);
  selectedTabChange$: BehaviorSubject<number> = new BehaviorSubject(0);
  foundCities$: BehaviorSubject<LocationModel[]> = new BehaviorSubject([]);
  foundStreets$: BehaviorSubject<LocationModel[]> = new BehaviorSubject([]);
  foundHouses$: BehaviorSubject<LocationModel[]> = new BehaviorSubject([]);
  cartDataChange$: BehaviorSubject<CartDataResponseModel> = new BehaviorSubject(null);

  private _subscriptions = [];
  private _isOrderLoading = false;
  private _positionInCart: number;
  private _validDeliveryFiasCode: string[];
  private _order: CartDataOrderResponseModel;
  private _deliveryMethods: DeliveryMethodModel[] = null;
  private _availableOrganizations: UserOrganizationModel[];

  private _consumerSubscription: Subscription;
  private _recaptchaSubscription: Subscription;
  private _pickupAreaSubscription: Subscription;
  private _consumerInnSubscription: Subscription;
  private _cityFiasCodeSubscription: Subscription;
  private _houseFiasCodeSubscription: Subscription;
  private _streetFiasCodeSubscription: Subscription;
  private _deliveryMethodSubscription: Subscription;

  get positionInCart(): number {
    return this._positionInCart;
  }

  get userInfo(): UserInfoModel {
    return this._userStateService.currentUser$.getValue()?.userInfo;
  }

  get isAnonymous(): boolean {
    return !this.userInfo;
  }

  get isAuthenticated(): boolean {
    return !!this.userInfo;
  }

  get hasRegisteredOrganizations(): boolean {
    return !!this._userService.organizations$.getValue()?.length;
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  get itemsControls(): FormGroup[] {
    return this.items.controls as FormGroup[];
  }

  get isOrderType(): boolean {
    return this._order?.tags?.includes('Order');
  }

  get isOrderLoading(): boolean {
    return this._isOrderLoading;
  }

  get unavailableToOrder(): boolean {
    const unavailableToOrderStatuses = ['TemporarilyOutOfSales', 'NoOfferAvailable'];
    return this._order.makeOrderViolations?.some((x) => unavailableToOrderStatuses.includes(x.code));
  }

  get minOrderAmountViolations(): any {
    return this._order.makeOrderViolations?.find((x) => 'SupplierPolicyViolated' === x.code && !x.tradeOfferId);
  }

  get availableOrganizations(): UserOrganizationModel[] {
    return this._availableOrganizations;
  }

  get relationEnumType(): RelationEnumModel {
    if (this.isMakeOrderOrRequestForPrice) {
      return this.isOrderType ? RelationEnumModel.MAKE_ORDER : RelationEnumModel.REQUEST_FOR_PRICE;
    }
    if (this.isRegisterAndMakeOrderOrRegisterAndRequestForPrice) {
      return this.isOrderType ? RelationEnumModel.REGISTER_AND_MAKE_ORDER : RelationEnumModel.REGISTER_AND_REQUEST_FOR_PRICE;
    }
  }

  get isMakeOrderOrRequestForPrice(): boolean {
    return !!this.makeOrderLinkOrRequestForPriceLink;
  }

  get makeOrderLinkOrRequestForPriceLink(): string {
    return this.makeOrderLink || this.requestForPriceLink
  }

  get makeOrderLink(): string {
    return this._order._links?.[RelationEnumModel.MAKE_ORDER]?.href
  }

  get requestForPriceLink(): string {
    return this._order._links?.[RelationEnumModel.REQUEST_FOR_PRICE]?.href
  }

  get isRegisterAndMakeOrderOrRegisterAndRequestForPrice(): boolean {
    return !!this.registerAndMakeOrderLinkOrRegisterAndRequestForPriceLink;
  }

  get registerAndMakeOrderLinkOrRegisterAndRequestForPriceLink(): string {
    return this.registerAndMakeOrderLink || this.registerAndRequestForPriceLink
  }

  get registerAndMakeOrderLink(): string {
    return this._order._links?.[RelationEnumModel.REGISTER_AND_MAKE_ORDER]?.href
  }

  get registerAndRequestForPriceLink(): string {
    return this._order._links?.[RelationEnumModel.REGISTER_AND_REQUEST_FOR_PRICE]?.href
  }

  get pickupPoints(): any[] {
    return this._order.deliveryOptions?.pickupPoints;
  }

  get deliveryMethods(): DeliveryMethodModel[] {
    return this._deliveryMethods;
  }

  get deliveryZones(): any[] {
    return this._order.deliveryOptions?.deliveryZones;
  }

  get deliveryByRussia(): boolean {
    return !this._validDeliveryFiasCode?.length || this._validDeliveryFiasCode.some((code) => code === CountryCode.RUSSIA);
  }

  get selectedDelivery(): boolean {
    return this.form.controls.deliveryMethod.value === DeliveryMethod.DELIVERY;
  }

  constructor(
    private _fb: FormBuilder,
    private _cartService: CartService,
    private _userService: UserService,
    private _locationService: LocationService,
    private _cartModalService: CartModalService,
    private _userStateService: UserStateService,
    private _recaptchaV3Service: ReCaptchaV3Service,
    private _localStorageService: LocalStorageService,
    private _notificationsService: NotificationsService,
    private _organizationsService: OrganizationsService,
    private _externalProvidersService: ExternalProvidersService,
  ) {
    this.form = this._fb.group({
      supplierName: this._fb.control(null),
      supplierInn: this._fb.control(null),
      consumerId: this._fb.control(null),
      consumerInn: this._fb.control(null,
        this.isAuthenticated && this.hasRegisteredOrganizations ? [] : [notBlankValidator, Validators.pattern('^[0-9]*$'), innConditionValidator]),
      consumerKpp: this._fb.control(null,
        this.isAuthenticated && this.hasRegisteredOrganizations ? [] : [Validators.pattern('^[0-9]*$'), notBlankValidator, kppConditionValidator, kppRequiredIfOrgConditionValidator('consumerInn')]),
      consumerName: this._fb.control(null,
        this.isAuthenticated && this.hasRegisteredOrganizations ? [] : [Validators.required, notBlankValidator, Validators.minLength(3), Validators.maxLength(300)]),
      total: this._fb.control(null),
      totalVat: this._fb.control(null),
      currencyCode: this._fb.control(null),
      deliveryMethod: this._fb.control(null,
        [Validators.required]),
      pickupArea: this._fb.group(
        {
          fiasCode: this._fb.control(null),
          title: this._fb.control(null),
          countryOksmCode: this._fb.control(null),
        },
      ),
      deliveryTo: this._fb.group(
        {
          fiasCode: this._fb.control(null),
          title: this._fb.control(null),
          city: this._fb.control(null),
          cityFiasCode: this._fb.control(null),
          street: this._fb.control(null),
          streetFiasCode: this._fb.control({ value: null, disabled: true }),
          house: this._fb.control(null),
          houseFiasCode: this._fb.control({ value: null, disabled: true }),
        }
      ),
      contactName: this._fb.control(this.userInfo?.fullName,
        [Validators.required, notBlankValidator, Validators.maxLength(200)]),
      contactPhone: this._fb.control(this.userInfo?.phone,
        [Validators.required, notBlankValidator, Validators.maxLength(16)]),
      contactEmail: this._fb.control(this.userInfo?.email,
        [Validators.required, Validators.email, Validators.maxLength(100)]),
      commentForSupplier: this._fb.control(null,
        [notBlankValidator, Validators.maxLength(900)]),
      isOrganizationAgent: this._fb.control(this.isAuthenticated && this.hasRegisteredOrganizations,
        [Validators.requiredTrue]),
      deliveryDesirableDate: this._fb.control(null),
      items: this._fb.array([]),
    });
  }

  ngOnDestroy(): void {
    unsubscribeList([
      this._consumerSubscription,
      this._recaptchaSubscription,
      this._pickupAreaSubscription,
      this._consumerInnSubscription,
      this._cityFiasCodeSubscription,
      this._houseFiasCodeSubscription,
      this._streetFiasCodeSubscription,
      this._deliveryMethodSubscription,
      ...this._subscriptions]);
  }

  init(order: CartDataOrderResponseModel, _positionInCart: number): void {
    this._order = order;
    this._positionInCart = _positionInCart;

    // Порядок вызова методов важен!
    this._initAvailableOrganizations(order.customersAudience);
    this._initDeliveryMethods(order.deliveryOptions);
    this._initForm(order, this._availableOrganizations?.[0]);
    this._initValidDeliveryFiasCode();
    this._initDeliveryCity();

    this._watchItemQuantityChanges();
    this._watchDeliveryMethodChanges();
    this._watchConsumerChanges();
    this._watchPickupAreaChanges();

    if (this.isAuthenticated && this.hasRegisteredOrganizations) {
      this._watchCityValueChanges();
      this._watchStreetValueChanges();
      this._watchHouseValueChanges();
    } else {
      this._watchOnlyCityValueChanges();
      this._watchConsumerInnValueChanges();
    }

    const tag = {
      event: 'BasketPage',
      currencyCode: order?.orderTotal?.currencyCode ? currencyCode(order?.orderTotal?.currencyCode) : 'RUB',
      value: order?.orderTotal?.total ? order.orderTotal.total / 100 : '',
      products_info: order.items?.map((item) => {
        return {
          id: item.sid || '',
          price: item.price ? item.price / 100 : '',
          quantity: item.quantity || '',
        };
      }),
    };
    this._externalProvidersService.fireGTMEvent(tag);
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

    if (this.form.invalid) {
      if (this.selectedTabChange$.getValue() === 0) {
        this.selectedTabChange$.next(1);
        return;
      }

      if (this.selectedTabChange$.getValue() === 1) {
        this.form.markAllAsTouched();

        if (this.form.invalid) {
          if (this.form.controls.isOrganizationAgent.invalid) {
            this.focus$.next('organizationAgentError');
          }

          if (this.form.controls.deliveryTo.invalid) {
            this.focus$.next('deliveryError');
          }

          if (this.form.controls.contactEmail.invalid) {
            this.focus$.next('emailError');
          }

          if (this.form.controls.contactPhone.invalid) {
            this.focus$.next('phoneError');
          }

          if (this.form.controls.contactName.invalid) {
            this.focus$.next('nameError');
          }

          if (this.form.controls.deliveryTo.invalid) {
            this.focus$.next('cityError');
          }

          if (this.form.controls.consumerName.invalid) {
            this.focus$.next('consumerNameError');
          }

          if (this.form.controls.consumerKpp.invalid) {
            this.focus$.next('consumerKppError');
          }

          if (this.form.controls.consumerInn.invalid) {
            this.focus$.next('consumerInnError');
          }
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

  removeItem(orderItem: any) {
    if (this.isOrderLoading) {
      return;
    }
    this._isOrderLoading = true;
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
                    id: orderItem?.sid?.value || '',
                    price: orderItem?.price?.value ? orderItem.price.value / 100 : '',
                    brand: '',
                    category: '',
                    variant: this._order?.supplier?.name || '',
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
        delay(500),
        switchMap(() => {
          return this._cartService.refreshAndGetActualCartDataRetry();
        }),
      ).subscribe((cartData) => {
        this.cartDataChange$.next(cartData);
      },
      (err) => {
        this._isOrderLoading = false;
        this._notificationsService.error();
      },
    );
  }

  proceedToCheckoutMetric(): void {
    const tag = {
      event: 'checkout',
      ecommerce: {
        currencyCode: this._order?.orderTotal?.currencyCode ? currencyCode(this._order?.orderTotal?.currencyCode) : 'RUB',
        value: this._order?.orderTotal?.total ? this._order.orderTotal.total / 100 : '',
        checkout: {
          actionField: { step: 1, option: 'checkout' },
          products: this._order.items?.map((item) => {
            return {
              name: item.productName || '',
              id: item.sid || '',
              price: item.price ? item.price / 100 : '',
              brand: '',
              category: '',
              variant: this._order?.supplier?.name || '',
              quantity: item.quantity || '',
            };
          }),
        },
      },
    };
    this._externalProvidersService.fireGTMEvent(tag);
  }

  authMetric(): void {
    const tag = {
      event: 'login',
    };
    this._externalProvidersService.fireGTMEvent(tag);
  }

  private _executeMakeOrderOrRequestForPrice() {
    const relationType = this.isOrderType ? RelationEnumModel.MAKE_ORDER : RelationEnumModel.REQUEST_FOR_PRICE;
    this._send(relationType, this.makeOrderLinkOrRequestForPriceLink, this._createOrderData());
  }

  private _executeRegisterAndMakeOrderOrRegisterAndRequestForPrice() {
    this._recaptchaSubscription = this._recaptchaV3Service
      .execute('action')
      .subscribe((token) => {
        const relationType =
          this.isOrderType ? RelationEnumModel.REGISTER_AND_MAKE_ORDER : RelationEnumModel.REGISTER_AND_REQUEST_FOR_PRICE;

        this._send(relationType, this.registerAndMakeOrderLinkOrRegisterAndRequestForPriceLink, this._createRegisterOrderData(), token);

      }, (err) => {
        this._notificationsService.error();
      });
  }

  private _send(relationType: RelationEnumModel, relationHref: string, orderData: any, recaptchaToken?: string) {
    this._cartService
      .handleMarketplaceOffer(relationType, relationHref, orderData, recaptchaToken)
      .pipe(
        delay(1000),
        switchMap(() => this._cartService.refreshAndGetActualCartDataRetry()),
        tap(() => {
          const tag = {
            event: 'transactionDL',
            ecommerce: {
              currencyCode: this._order?.orderTotal?.currencyCode ? currencyCode(this._order?.orderTotal?.currencyCode) : 'RUB',
              purchase: {
                actionField: {
                  id: Math.random(),
                  revenue: this._order?.orderTotal?.total ? this._order.orderTotal.total / 100 : '',
                },
                products: this._order.items?.map((item) => {
                  return {
                    name: item.productName || '',
                    id: item.sid || '',
                    price: item.price ? item.price / 100 : '',
                    brand: '',
                    category: '',
                    variant: this._order?.supplier?.name || '',
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
          this._cartModalService
            .openRegisterAndOrderSentModal(this.isOrderType, this.isAnonymous, this.form.value.consumerInn, this.form.value.consumerKpp);
        }
        this.cartDataChange$.next(cartData);
      },
      (err) => {
        this._notificationsService.error();
      },
    );
  }

  private _initForm(order: CartDataOrderResponseModel, consumerOrg: UserOrganizationModel): void {
    this.form.patchValue({
      supplierName: order.supplier?.name,
      supplierInn: order.supplier?.inn,
      consumerName: consumerOrg?.organizationName,
      consumerInn: consumerOrg?.legalRequisites.inn,
      consumerKpp: consumerOrg?.legalRequisites.kpp,
      consumerId: consumerOrg?.organizationId,
      total: order.orderTotal?.total,
      totalVat: order.orderTotal?.totalVat,
      currencyCode: order.orderTotal?.currencyCode,
      deliveryMethod: this.deliveryMethods[0]?.value,
      pickupArea: {
        fiasCode: order.deliveryOptions?.pickupPoints?.[0].fiasCode,
        title: order.deliveryOptions?.pickupPoints?.[0].title,
        countryOksmCode: order.deliveryOptions?.pickupPoints?.[0].countryOksmCode,
      },
    });

    this._changeValidatorInControlCityFiasCode(this.deliveryMethods[0]?.value);
    this.form.setControl('items', this._fb.array(order.items.map((product) => this._createItem(product))));
  }

  private _createItem(product: any): FormGroup {
    return this._fb.group({
      tradeOfferId: product.tradeOfferId,
      sid: product.sid,
      productName: product.productName,
      productDescription: product.productDescription,
      barCodes: this._fb.array(product?.barCodes || []),
      partNumber: product.partNumber,
      packaging: product.packaging,
      imageUrl: this._fb.array(product.imageUrls || []),
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
      warning: this._fb.array(this._warnings(product.tradeOfferId)),
      availableToOrder: this._fb.control(this._availableToOrder(product.tradeOfferId), [Validators.requiredTrue]),
      vat: product.vat,
      total: product.itemTotal?.total,
      totalWithoutVat: product.itemTotal?.totalWithoutVat,
      _links: product._links,
    });
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
            deliveryTo: {
              ...(this.form.get('deliveryTo.fiasCode').value && { fiasCode: this.form.get('deliveryTo.fiasCode').value }),
              title: this.form.get('deliveryTo.title').value,
              countryOksmCode: CountryCode.RUSSIA,
            },
          }
          : {
            pickupFrom: {
              fiasCode: this.form.get('pickupArea.fiasCode').value,
              title: this.form.get('pickupArea.title').value,
              countryOksmCode: CountryCode.RUSSIA,
            },
          }),
      },
    };
  }

  private _createRegisterOrderData() {
    const comment = this._orderComment();

    return {
      customerOrganization: {
        name: this.form.value.consumerName,
        inn: this.form.value.consumerInn,
        ...(this.form.value.consumerKpp && { kpp: this.form.value.consumerKpp })
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
            deliveryTo: {
              ...(this.form.get('deliveryTo.fiasCode').value && { fiasCode: this.form.get('deliveryTo.fiasCode').value }),
              title: this.form.get('deliveryTo.title').value,
              countryOksmCode: CountryCode.RUSSIA,
            },
          }
          : {
            pickupFrom: {
              fiasCode: this.form.get('pickupArea.fiasCode').value,
              title: this.form.get('pickupArea.title').value,
              countryOksmCode: CountryCode.RUSSIA,
            },
          }),
      },
    };
  }

  private _orderComment() {
    return `${this.form.value.deliveryDesirableDate ? `Желаемая дата доставки: ${format(new Date(this.form.value.deliveryDesirableDate), 'dd-MM-yyyy HH:mm')}.` : ''}${this.form.value.commentForSupplier ? ` ${this.form.value.commentForSupplier}` : ''}`;
  }

  private _initDeliveryMethods(deliveryOptions: any): void {
    this._deliveryMethods = [];

    if (
      !deliveryOptions ||
      (!deliveryOptions.deliveryZones?.length && !deliveryOptions.pickupPoints?.length) ||
      (deliveryOptions.deliveryZones?.length && !deliveryOptions.pickupPoints?.length)
    ) {
      this._deliveryMethods.push(
        { label: 'Доставка', value: DeliveryMethod.DELIVERY, disabled: false },
        { label: 'Самовывоз отсутствует', value: DeliveryMethod.PICKUP, disabled: true },
      );
    } else if (deliveryOptions.pickupPoints?.length && !deliveryOptions.deliveryZones?.length) {
      this._deliveryMethods.push(
        { label: 'Самовывоз', value: DeliveryMethod.PICKUP, disabled: false },
        { label: 'Доставка отсутствует', value: DeliveryMethod.DELIVERY, disabled: true },
      );
    } else if (deliveryOptions.pickupPoints?.length && deliveryOptions.deliveryZones?.length) {
      this._deliveryMethods.push(
        { label: 'Самовывоз', value: DeliveryMethod.PICKUP, disabled: false },
        { label: 'Доставка', value: DeliveryMethod.DELIVERY, disabled: false },
      );
    }
  }

  private _watchDeliveryMethodChanges() {
    this._deliveryMethodSubscription = this.form.controls.deliveryMethod.valueChanges
      .subscribe((type) => {
        this._changeValidatorInControlCityFiasCode(type);
      });
  }

  private _watchConsumerChanges() {
    this._consumerSubscription = this.form.controls.consumerId.valueChanges
      .subscribe((consumerId) => {
        if (isUuid(consumerId)) {
          const consumer = this._availableOrganizations?.find((res) => res.organizationId === consumerId);
          this.form.patchValue({
            consumerName: consumer?.organizationName,
            consumerInn: consumer?.legalRequisites.inn,
          });
        }
      });
  }

  private _watchPickupAreaChanges() {
    this._pickupAreaSubscription = this.form.get('pickupArea.fiasCode').valueChanges
      .subscribe((fiasCode) => {
        if (isUuid(fiasCode)) {
          const pickupPoints = this._order?.deliveryOptions?.pickupPoints.find((res) => res.fiasCode === fiasCode);
          this.form.controls.pickupArea.patchValue({
            title: pickupPoints?.title,
            countryOksmCode: pickupPoints?.countryOksmCode,
          });
        }
      });
  }

  private _watchItemQuantityChanges() {
    this.itemsControls?.forEach((item) => {
      const quantityControl = item.controls.quantity;
      const subscription = quantityControl.valueChanges
        .pipe(
          tap((_) => {
            this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.ORDER_PUT);
          }),
          switchMap((orderQuantity) => {
            if (!orderQuantity || orderQuantity < item.value.orderQtyMin) {
              if (quantityControl.touched) {
                orderQuantity = item.value.orderQtyMin;
                quantityControl.patchValue(orderQuantity);
                quantityControl.markAsUntouched();
              } else {
                quantityControl.markAsTouched();
                return of(null);
              }
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
            return this._cartService.refreshAndGetActualCartDataRetry();
          }),
          retry(3),
        ).subscribe((cartData) => {
            this._changeOrderData(cartData);
          },
          (err) => {
            this._notificationsService.error();
          },
        );

      this._subscriptions.push(subscription)
    });
  }

  private _watchConsumerInnValueChanges() {
    this._consumerInnSubscription = this.form.get('consumerInn').valueChanges
      .pipe(
        switchMap((inn) => {
          if ((inn.length === 10 || inn.length === 12) && this.form.get('consumerInn').valid) {
            this.form.controls.consumerKpp.patchValue(null, { emitEvent: true, onlySelf: true });
            this.form.controls.consumerName.patchValue(null, { emitEvent: true, onlySelf: true });
            return this._organizationsService.findCounterpartyDataByInn(inn);
          }
          return of(null);
        }),
        switchMap((org) => {
          if (org) {
            this.form.controls.consumerKpp.patchValue(org.kpp, { emitEvent: true, onlySelf: true });
            this.form.controls.consumerName.patchValue(org.name, { emitEvent: true, onlySelf: true });
            setTimeout(() => {
              this.focus$.next('contactName');
            }, 100);
          }
          return of(null)
        }),
      )
      .subscribe();
  }

  private _watchOnlyCityValueChanges() {
    this._cityFiasCodeSubscription = this.form.get('deliveryTo.cityFiasCode').valueChanges
      .pipe(
        tap((cityFiasCode) => {
          if (isUuid(cityFiasCode)) {
            const location = this.foundCities$.getValue().find((res) => res.fias === cityFiasCode);
            this.form.get('deliveryTo.city').patchValue(location?.locality, { onlySelf: true, emitEvent: false });
            this._checkAndSaveDelivery(cityFiasCode, location);
          }
        }),
        tap((cityFiasCode) => {
          if (isUuid(cityFiasCode)) {
            setTimeout(() => {
              this.focus$.next('city');
            }, 100);
          }
        }),
        switchMap((cityFiasCode) => {
          if (!isUuid(cityFiasCode)) {
            this._saveDelivery(null, null);

            if (cityFiasCode?.length > 1) {
              this.form.get('deliveryTo.city').patchValue(cityFiasCode, { onlySelf: true, emitEvent: false });
              return this._locationService.searchAddresses({
                deliveryCity: cityFiasCode,
              }, Level.CITY);
            }
          }
          return of([]);
        }),
        catchError(() => {
          this._cityFiasCodeSubscription?.unsubscribe();
          this._watchOnlyCityValueChanges();
          return of(this.foundCities$.getValue());
        }),
      ).subscribe((cities) => {
          this.foundCities$.next(cities
            .filter((value, index, self) => value.locality && self.findIndex(f => f.locality === value.locality) === index));
        }
      );
  }

  private _watchCityValueChanges() {
    this._cityFiasCodeSubscription = this.form.get('deliveryTo.cityFiasCode').valueChanges
      .pipe(
        tap((cityFiasCode) => {
          if (isUuid(cityFiasCode)) {
            const location = this.foundCities$.getValue().find((res) => res.fias === cityFiasCode);
            this.form.get('deliveryTo.city').patchValue(location?.locality, { onlySelf: true, emitEvent: false });
            this._checkAndSaveDelivery(cityFiasCode, location);
          }
        }),
        tap((cityFiasCode) => {
          if (isUuid(cityFiasCode)) {
            this.form.get('deliveryTo.streetFiasCode').enable({ onlySelf: true, emitEvent: false });
            this.form.get('deliveryTo.houseFiasCode').enable({ onlySelf: true, emitEvent: false });
            setTimeout(() => {
              this.focus$.next('city');
            }, 100);
          }
        }),
        switchMap((cityFiasCode) => {
          if (!isUuid(cityFiasCode)) {
            this._saveDelivery(null, null);

            this.form.get('deliveryTo.houseFiasCode').patchValue(null, { onlySelf: true, emitEvent: false });
            this.form.get('deliveryTo.houseFiasCode').disable({ onlySelf: true, emitEvent: false });

            this.form.get('deliveryTo.streetFiasCode').patchValue(null, { onlySelf: true, emitEvent: false });
            this.form.get('deliveryTo.streetFiasCode').disable({ onlySelf: true, emitEvent: false });

            this.form.get('deliveryTo.city').patchValue(cityFiasCode, { onlySelf: true, emitEvent: false });

            if (cityFiasCode?.length > 1) {
              return this._locationService.searchAddresses({
                deliveryCity: cityFiasCode,
              }, Level.CITY);
            }
          }
          return of([]);
        }),
        catchError(() => {
          this._cityFiasCodeSubscription?.unsubscribe();
          this._watchCityValueChanges();
          return of(this.foundCities$.getValue());
        }),
      ).subscribe((cities) => {
          this.foundCities$.next(cities
            .filter((value, index, self) => value.locality && self.findIndex(f => f.locality === value.locality) === index));
        }
      );
  }

  private _watchStreetValueChanges() {
    this._streetFiasCodeSubscription = this.form.get('deliveryTo.streetFiasCode').valueChanges
      .pipe(
        tap((streetFiasCode) => {
          if (isUuid(streetFiasCode)) {
            const location = this.foundStreets$.getValue().find((res) => res.fias === streetFiasCode);
            this.form.get('deliveryTo.street').patchValue(location?.street, { onlySelf: true, emitEvent: false });
            this._checkAndSaveDelivery(streetFiasCode, location);
          }
        }),
        tap((streetFiasCode) => {
          if (isUuid(streetFiasCode)) {
            setTimeout(() => {
              this.focus$.next('street');
            }, 100);
          }
        }),
        switchMap((streetFiasCode) => {
          if (!isUuid(streetFiasCode)) {
            this._saveDelivery(null, `${streetFiasCode} ул, ${this.form.get('deliveryTo.city').value}`);
            this.form.get('deliveryTo.houseFiasCode').patchValue(null, { onlySelf: true, emitEvent: false });
            this.form.get('deliveryTo.street').patchValue(streetFiasCode, { onlySelf: true, emitEvent: false });

            if (streetFiasCode?.length > 0) {
              return this._locationService.searchAddresses({
                deliveryCity: this.form.get('deliveryTo.city').value,
                deliveryStreet: streetFiasCode,
              }, Level.STREET);
            }
          }
          return of([]);
        }),
        catchError(() => {
          this._streetFiasCodeSubscription?.unsubscribe();
          this._watchStreetValueChanges();
          return of(this.foundStreets$.getValue());
        }),
      ).subscribe((streets) => {
          this.foundStreets$.next(streets
            .filter((value, index, self) => value.street && self.findIndex(f => f.street === value.street) === index));
        }
      );
  }

  private _watchHouseValueChanges() {
    this._houseFiasCodeSubscription = this.form.get('deliveryTo.houseFiasCode').valueChanges
      .pipe(
        tap((houseFiasCode) => {
          if (isUuid(houseFiasCode)) {
            const location = this.foundHouses$.getValue().find((res) => res.fias === houseFiasCode);
            this.form.get('deliveryTo.house').patchValue(location?.house, { onlySelf: true, emitEvent: false });
            if (!isUuid(this.form.get('deliveryTo.streetFiasCode').value)) {
              this.form.get('deliveryTo.street').patchValue(location?.street, { onlySelf: true, emitEvent: false });
              this.form.get('deliveryTo.streetFiasCode').patchValue(location?.street, {
                onlySelf: true,
                emitEvent: false
              });
            }
            this._checkAndSaveDelivery(houseFiasCode, location);
          }
        }),
        tap((streetFiasCode) => {
          if (isUuid(streetFiasCode)) {
            setTimeout(() => {
              this.focus$.next('house');
            }, 100);
          }
        }),
        switchMap((houseFiasCode) => {
          if (!isUuid(houseFiasCode)) {
            this._saveDelivery(null, `${this.form.get('deliveryTo.street').value} ул, дом ${houseFiasCode}, ${this.form.get('deliveryTo.city').value}`);
            this.form.get('deliveryTo.house').patchValue(houseFiasCode, { onlySelf: true, emitEvent: false });

            if (houseFiasCode.includes('литер')) {
              /*
               * сервис https://api.orgaddress.1c.ru не может найти адрес если передать текст в формате 'text=Санкт-Петербург г, Ленина ул, 12/36, литер А'
               * при этом 'text=Санкт-Петербург г, Ленина ул, 12/36, литер' успешно находится, поэтому пришлось подоткнуть тут данный костыль
               */
              houseFiasCode = houseFiasCode.substr(0, houseFiasCode.indexOf('литер') + 5);
            }

            const query = {
              deliveryCity: this.form.get('deliveryTo.city').value,
              deliveryStreet: this.form.get('deliveryTo.street').value,
              deliveryHouse: houseFiasCode,
            };
            return this._locationService.searchAddresses(query, Level.HOUSE);
          }
          return of([]);
        }),
        catchError(() => {
          this._houseFiasCodeSubscription?.unsubscribe();
          this._watchHouseValueChanges();
          return of(this.foundHouses$.getValue());
        }),
      ).subscribe((houses) => {
          this.foundHouses$.next(houses
            .filter((value, index, self) => value.house && self.findIndex(f => f.house === value.house) === index));
        }
      );
  }

  private _checkAndSaveDelivery(cityFiasCode, location: LocationModel) {
    if (this.deliveryByRussia) {
      this._saveDelivery(cityFiasCode, location?.fullName);
    } else {
      this._locationService.isDeliveryAvailable(location?.fias, this._validDeliveryFiasCode)
        .subscribe((isAvailable) => {
          if (isAvailable) {
            this._saveDelivery(cityFiasCode, location?.fullName);
          } else {
            this.form.controls.deliveryTo.setErrors({ locationUnavailable: true }, { emitEvent: true });
          }
        });
    }
  }

  private _changeOrderData(cartData: CartDataResponseModel) {
    const key = this.relationEnumType;
    const link = this.isMakeOrderOrRequestForPrice
      ? this.makeOrderLinkOrRequestForPriceLink : this.registerAndMakeOrderLinkOrRegisterAndRequestForPriceLink;

    this._order = cartData.content.find((item) => item._links?.[key]?.href === link);

    this.form.patchValue({
      total: this._order.orderTotal?.total,
      totalVat: this._order.orderTotal?.totalVat,
    }, { onlySelf: true, emitEvent: true });

    this.itemsControls.forEach((control, index) => {
      const product = this._order.items[index];
      control.patchValue({
        price: product.price,
        priceBeforeDiscount: product.priceBeforeDiscount,
        maxDaysForShipment: product.maxDaysForShipment,
        priceIncludesVAT: product.priceIncludesVAT || false,
        orderQtyMin: product.orderQtyMin,
        orderQtyStep: product.orderQtyStep,
        availableToOrder: this._availableToOrder(product.tradeOfferId),
        total: product.itemTotal?.total,
        totalWithoutVat: product.itemTotal?.totalWithoutVat,
      }, { onlySelf: true, emitEvent: true });

      control.setControl('warning', this._fb.array(this._warnings(product.tradeOfferId)));
    });
  }

  private _changeValidatorInControlCityFiasCode(type) {
    if (type === DeliveryMethod.DELIVERY) {
      this.form.get('deliveryTo.cityFiasCode').setValidators([Validators.required, cityNotDefinedValidator, notBlankValidator]);
      this.form.get('deliveryTo.cityFiasCode').updateValueAndValidity({ onlySelf: false, emitEvent: false });
    } else {
      this.form.get('deliveryTo.cityFiasCode').clearValidators();
      this.form.get('deliveryTo.cityFiasCode').updateValueAndValidity({ onlySelf: false, emitEvent: false });
    }
  }

  private _warnings(tradeOfferId: string): FormControl[] {
    return this._order.makeOrderViolations?.filter((x) => tradeOfferId === x.tradeOfferId).map((x) => this._fb.control(x.message)) || [];
  }

  private _availableToOrder(tradeOfferId: string): boolean {
    if (!this._order.makeOrderViolations) {
      return true;
    }

    return this._order.makeOrderViolations
      .filter((x) => ['TemporarilyOutOfSales', 'NoOfferAvailable'].includes(x.code))
      .every((x) => x.tradeOfferId !== tradeOfferId);
  }

  private _initAvailableOrganizations(customersAudience: any[]) {
    if (customersAudience?.length) {
      this._availableOrganizations = this._userService.organizations$.getValue()
        .filter((org) => {
          const legalId = innKppToLegalId(org.legalRequisites.inn, org.legalRequisites.kpp);
          return customersAudience.some((aud) => aud.legalId === legalId);
        });
    } else {
      this._availableOrganizations = this._userService.organizations$.getValue();
    }
  }

  private _initValidDeliveryFiasCode(): void {
    this._validDeliveryFiasCode =
      this._order.deliveryOptions?.deliveryZones?.filter((zone) => zone.fiasCode || zone.countryOksmCode === CountryCode.RUSSIA)
        .map((zone) => !zone.fiasCode ? zone.countryOksmCode : zone.fiasCode)
      || [];
  }

  private _initDeliveryCity() {
    if (this._localStorageService.isApproveRegion()) {
      const userLocation = this._locationService.getSelectedCustomLocation();
      if (userLocation) {
        if (this.deliveryByRussia) {
          this._saveCityAndEnableStreetAndHouse(userLocation);

        } else {
          this._locationService.isDeliveryAvailable(userLocation.fias, this._validDeliveryFiasCode)
            .subscribe((isAvailable) => {
              if (isAvailable) {
                this._saveCityAndEnableStreetAndHouse(userLocation);
              }
            });
        }
      }
    } else {
      if (this._localStorageService.hasUserGeolocation()) {
        of(this._localStorageService.getUserGeolocation())
          .pipe(
            switchMap((region) => {
              if (Megacity.FEDERAL_CITIES.some((loc) => loc.name === region.city)) {
                return of(Megacity.FEDERAL_CITIES.filter((loc) => loc.name === region.city));
              }

              return this._locationService.searchAddresses({
                deliveryRegion: region.region,
                deliveryCity: region.city
              }, Level.CITY)
            }),
            catchError(() => {
              return of([]);
            })
          )
          .subscribe((locations) => {
            if (locations?.length) {
              this._saveCityAndEnableStreetAndHouse(locations[0]);
            }
          });
      }
    }
  }

  private _saveDelivery(fiasCode: string, title: string): void {
    this.form.get('deliveryTo.fiasCode').patchValue(fiasCode, { onlySelf: true, emitEvent: false });
    this.form.get('deliveryTo.title').patchValue(title, { onlySelf: true, emitEvent: false });
  }

  private _saveCityAndEnableStreetAndHouse(location: LocationModel): void {
    this.form.get('deliveryTo.cityFiasCode').setValue(location.locality, { onlySelf: true, emitEvent: false });
    this.form.get('deliveryTo.city').setValue(location.locality, { onlySelf: true, emitEvent: false });

    this.form.get('deliveryTo.streetFiasCode').enable({ onlySelf: true, emitEvent: false });
    this.form.get('deliveryTo.houseFiasCode').enable({ onlySelf: true, emitEvent: false });
    this._saveDelivery(location.fias, location.fullName);
  }
}
