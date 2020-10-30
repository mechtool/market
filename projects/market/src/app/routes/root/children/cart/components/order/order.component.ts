import {
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
  CartDataOrderModel,
  CartDataResponseModel,
  CountryCode,
  DeliveryMethod,
  Level,
  LocationModel,
  MetrikaEventTypeModel,
  RelationEnumModel,
  UserOrganizationModel,
} from '#shared/modules/common-services/models';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import format from 'date-fns/format';
import { absoluteImagePath, currencyCode, innKppToLegalId, stringToHex } from '#shared/utils';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import {
  BNetService,
  CartService,
  ExternalProvidersService,
  LocationService,
  NotificationsService,
  TradeOffersService,
  UserService,
} from '#shared/modules/common-services';
import { DeliveryMethodModel } from './models/delivery-method.model';
import { UserInfoModel } from '#shared/modules/common-services/models/user-info.model';
import { AuthModalService } from '#shared/modules/setup-services/auth-modal.service';
import { CartModalService } from '../../cart-modal.service';
import { DeliveryOptionsModel } from './models';
import { HttpErrorResponse } from '@angular/common/http';

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
export class CartOrderComponent implements OnInit, OnDestroy {
  @ViewChild('elementInputCity') elementInputCity: ElementRef;
  @ViewChild('elementInputStreet') elementInputStreet: ElementRef;
  @ViewChild('elementInputHouse') elementInputHouse: ElementRef;
  @Input() order: CartDataOrderModel;
  @Input() userInfo: UserInfoModel;
  @Output() cartDataChange: EventEmitter<any> = new EventEmitter();
  form: FormGroup;
  availableUserOrganizations: UserOrganizationModel[];
  isOrderLoading = false;
  deliveryMethods: DeliveryMethodModel[] = null;
  selectedTabIndex = 0;
  selectedAddress: LocationModel;
  foundCities: string[];
  foundStreets: string[];
  foundHouses: string[];
  minDate = new Date();
  private foundLocations: LocationModel[];
  private validDeliveryFiasCode: string[];

  get orderType(): 'order' | 'priceRequest' {
    return this.order.tags?.includes('Order') ? 'order' : 'priceRequest' || 'order';
  }

  get unavailableToOrderTradeOfferIds(): string[] {
    const unavailableToOrderStatuses = ['TemporarilyOutOfSales', 'NoOfferAvailable'];
    return this.order.makeOrderViolations?.filter((x) => unavailableToOrderStatuses.includes(x.code)).map((x) => x.tradeOfferId) || [];
  }

  get consumerName(): string {
    return this.form.get('consumerName').value?.trim();
  }

  get supplierName(): string {
    return this.order.supplier?.name?.trim();
  }

  get supplierINN(): number {
    return +this.order.supplier?.inn;
  }

  get supplierKPP(): number {
    return +this.order.supplier?.kpp;
  }

  get supplierPhone(): string {
    return this.order.supplier?.phone?.trim();
  }

  get supplierEmail(): string {
    return this.order.supplier?.email?.trim();
  }

  get total(): number {
    return +this.form.get('total').value;
  }

  get totalVat(): number {
    return +this.form.get('totalVat').value;
  }

  get deliveryMethod(): string {
    return this.form.get('deliveryMethod').value?.trim();
  }

  get pickupArea(): any {
    return this.form.get('pickupArea').value;
  }

  get pickupPoints(): any[] {
    return this.order.deliveryOptions?.pickupPoints;
  }

  get deliveryZones(): any[] {
    return this.order.deliveryOptions?.deliveryZones;
  }

  get deliveryAvailable(): boolean {
    return this.deliveryMethod === DeliveryMethod.DELIVERY;
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  get itemsControls(): FormGroup[] {
    return this.items.controls as FormGroup[];
  }

  get orderRelationHref(): string {
    if (this.orderType === 'order') {
      return this.order._links?.[RelationEnumModel.ORDER_CREATE]?.href;
    }
    return this.order._links?.[RelationEnumModel.PRICEREQUEST_CREATE]?.href;
  }

  get currencyCode(): string {
    return currencyCode(this.order.orderTotal?.currencyCode);
  }

  constructor(
    private _cdr: ChangeDetectorRef,
    private _fb: FormBuilder,
    private _cartService: CartService,
    private _userService: UserService,
    private _locationService: LocationService,
    private _bnetService: BNetService,
    private _router: Router,
    private _tradeOffersService: TradeOffersService,
    private _notificationsService: NotificationsService,
    private _authModalService: AuthModalService,
    private _cartModalService: CartModalService,
    private _externalProvidersService: ExternalProvidersService,
  ) {}

  ngOnInit() {
    this._getDeliveryMethods(this.order.deliveryOptions)
      .pipe(
        tap((res) => {
          this.deliveryMethods = res;
          this.form = this._initForm(this.order, this.deliveryMethods, this.userInfo);
          this.availableUserOrganizations = this._getAvailableOrganizations(this._userService.organizations$.value, this.order);
          this._initConsumer(this.availableUserOrganizations, this.order);
        }),
        switchMap((res) => {
          return this._getFoundLocations(this.order);
        }),
      )
      .subscribe((validDeliveryArea) => {
        this.validDeliveryFiasCode = validDeliveryArea;
        this._watchDeliveryAreaUserChanges();
        this._watchItemQuantityChanges();
      });
  }

  ngOnDestroy() {
    this._cartService.pullStorageCartData();
  }

  citySelected() {
    if (this.form.get('deliveryArea').get('deliveryCity').value?.length) {
      this.form.get('deliveryArea').get('deliveryStreet').enable({ onlySelf: true, emitEvent: false });
      this.elementInputStreet?.nativeElement.focus();
    }
  }

  streetSelected() {
    if (this.form.get('deliveryArea').get('deliveryStreet').value?.length) {
      this.form.get('deliveryArea').get('deliveryHouse').enable({ onlySelf: true, emitEvent: false });
      this.elementInputHouse?.nativeElement.focus();
    }
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
        catchError((err) => {
          return this._bnetService.getCartDataByCartLocation(this._cartService.getCart$().value).pipe(
            tap((res) => {
              this.cartDataChange.emit(res);
              const foundOrder = this._findOrderInCart(res);
              if (foundOrder) {
                this._resetOrder(foundOrder);
              }
            }),
          );
        }),
        switchMap((res) => {
          this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.ORDER_PUT);
          return res ? of(null) : this._bnetService.getCartDataByCartLocation(this._cartService.getCart$().value);
        }),
      )
      .subscribe(
        (res) => {
          this.cartDataChange.emit(res);
          if (res) {
            const foundOrder = this._findOrderInCart(res);
            if (foundOrder) {
              this._resetOrder(foundOrder);
            }
          }
          this._cartService.setActualCartData().subscribe();
        },
        (err) => {
          this.isOrderLoading = false;
          this._cdr.detectChanges();
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );
  }

  checkForValidityAndCreateOrder() {
    this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.ORDER_TRY);
    if (!this.userInfo) {
      this._authModalService.openAuthDecisionMakerModal(
        `Чтобы оформить заказ необходимо зарегистрироваться или войти под своей учетной записью "1С".
        Данные в корзине сохранятся.`,
      );
      return;
    }

    if (!this.availableUserOrganizations?.length) {
      this._authModalService.openEmptyOrganizationsInfoModal(
        'Чтобы оформить заказ необходимо иметь хотя бы одну зарегистрированную организацию.',
      );
      return;
    }

    if (!this.orderRelationHref) {
      this.changeSelectedTabIndex(0);
      this._cartModalService.openOrderUnavailableModal();
      return;
    }

    if (!this.form.valid || (!this.selectedAddress && this.deliveryAvailable)) {
      this.changeSelectedTabIndex(1);

      if (!this.form.valid) {
        Object.keys(this.form.controls).forEach((key) => {
          this.form.controls[key].markAsDirty();
        });
      }

      if (!this.selectedAddress && this.deliveryAvailable) {
        this.form.controls.deliveryArea.setErrors({ deliveryAreaCondition: true }, { emitEvent: true });
        this.elementInputCity?.nativeElement.focus();
      }

      return;
    }

    this._createOrder();
  }

  changeSelectedTabIndex(tabIndex: number) {
    this.selectedTabIndex = tabIndex;
  }

  setHexColor(str: string): string {
    return stringToHex(str);
  }

  setConsumer(userOrganization: any): void {
    this.form.patchValue({
      consumerName: userOrganization.organizationName,
      consumerINN: userOrganization.legalRequisites.inn,
      consumerKPP: userOrganization.legalRequisites.kpp,
      consumerId: userOrganization.organizationId,
    });
    this._cartService.partiallyUpdateStorageByOrder({
      ...this.order,
      ...{
        consumer: {
          name: userOrganization.organizationName || null,
          inn: userOrganization.legalRequisites?.inn || null,
          kpp: userOrganization.legalRequisites?.kpp || null,
          id: userOrganization.organizationId || null,
        },
      },
    });
  }

  goToTradeOffer(tradeOfferId: string) {
    if (tradeOfferId) {
      this._tradeOffersService.get(tradeOfferId).subscribe(
        (res) => {
          const supplierId = res.supplier?.bnetInternalId;
          if (supplierId) {
            this._router.navigate([`./supplier/${supplierId}/offer/${tradeOfferId}`]);
          }
          if (!supplierId) {
            console.log('Не удалось получить поставщика по ТП');
          }
        },
        (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this._notificationsService.error('Данный товар недоступен к просмотру');
            return;
          }
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );
    }
    if (!tradeOfferId) {
      this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
    }
  }

  disabledDate(current: Date): boolean {
    return differenceInCalendarDays(current, new Date()) < 1;
  }

  private _findOrderInCart(cartData: CartDataResponseModel): any {
    const relationObject = this.orderType === 'order' ? RelationEnumModel.ORDER_CREATE : RelationEnumModel.PRICEREQUEST_CREATE;
    return cartData.content.find((orderItem) => {
      return this.orderRelationHref && this.orderRelationHref === orderItem._links?.[relationObject]?.href;
    });
  }

  private _getFoundLocations(order: CartDataOrderModel): Observable<string[]> {
    if (order.deliveryOptions?.deliveryZones?.length) {
      return of(
        order.deliveryOptions.deliveryZones
          .filter((zone) => zone.fiasCode || zone.countryOksmCode === CountryCode.RUSSIA)
          .map((zone) => {
            if (!zone.fiasCode) {
              return zone.countryOksmCode;
            }
            return zone.fiasCode;
          }),
      );
    }
    return of([]);
  }

  private _watchDeliveryAreaUserChanges() {
    this.form.controls.deliveryArea
      .get('deliveryCity')
      .valueChanges.pipe(
        switchMap((city) => {
          if (city?.length > 1) {
            this.form.get('deliveryArea').get('deliveryHouse').setValue('', { onlySelf: true, emitEvent: false });
            this.form.get('deliveryArea').get('deliveryHouse').disable({ onlySelf: true, emitEvent: false });
            this.form.get('deliveryArea').get('deliveryStreet').setValue('', { onlySelf: true, emitEvent: false });
            this.form.get('deliveryArea').get('deliveryStreet').disable({ onlySelf: true, emitEvent: false });
            return this._locationService.searchAddresses({ deliveryCity: city }, Level.CITY);
          }
          return of([]);
        }),
      )
      .subscribe(
        (cities) => {
          this.selectedAddress = null;
          this.foundStreets = [];
          this.foundHouses = [];
          this.foundLocations = [];
          this.foundCities = cities.map((city) => city.locality).filter((value, index, self) => self.indexOf(value) === index);
          this._cdr.detectChanges();
        },
        (err) => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );

    this.form.controls.deliveryArea
      .get('deliveryStreet')
      .valueChanges.pipe(
        switchMap((street) => {
          if (street?.length && this.form.get('deliveryArea').get('deliveryStreet').enabled) {
            this.form.get('deliveryArea').get('deliveryHouse').setValue('', { onlySelf: true, emitEvent: false });
            this.form.get('deliveryArea').get('deliveryHouse').disable({ onlySelf: true, emitEvent: false });
            const query = {
              deliveryCity: this.form.controls.deliveryArea.get('deliveryCity').value,
              deliveryStreet: street,
            };
            return this._locationService.searchAddresses(query, Level.STREET);
          }
          return of([]);
        }),
      )
      .subscribe(
        (cities) => {
          this.selectedAddress = null;
          this.foundHouses = [];
          this.foundLocations = [];
          this.foundStreets = cities.map((city) => city.street);
          this._cdr.detectChanges();
        },
        (err) => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );

    this.form.controls.deliveryArea
      .get('deliveryHouse')
      .valueChanges.pipe(
        switchMap((house) => {
          if (house?.length && this.form.get('deliveryArea').get('deliveryHouse').enabled) {
            const query = {
              deliveryCity: this.form.controls.deliveryArea.get('deliveryCity').value,
              deliveryStreet: this.form.controls.deliveryArea.get('deliveryStreet').value,
              deliveryHouse: house,
            };
            return this._locationService.searchAddresses(query, Level.HOUSE);
          }
          return of([]);
        }),
      )
      .subscribe(
        (cities) => {
          this.foundHouses = cities.map((city) => city.house);
          this.foundLocations = cities;
          this.houseSelected();
          this._cdr.detectChanges();
        },
        (err) => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );
  }

  private houseSelected() {
    const house = this.form.controls.deliveryArea.value.deliveryHouse;
    const location = this.foundLocations.find((loc) => loc.house === house);

    if (!location) {
      this.form.controls.deliveryArea.setErrors({ deliveryNotAvailable: true }, { emitEvent: true });
    } else {
      const hasRussianCode = this.validDeliveryFiasCode.some((code) => code === CountryCode.RUSSIA);

      if (hasRussianCode) {
        this.selectedAddress = location;
      } else if (this.validDeliveryFiasCode?.length) {
        this._locationService.isDeliveryAvailable(location.fias, this.validDeliveryFiasCode).subscribe((isAvailable) => {
          if (isAvailable) {
            this.selectedAddress = location;
          } else {
            this.form.controls.deliveryArea.setErrors({ deliveryNotAvailable: true }, { emitEvent: true });
          }
        });
      } else {
        // todo Пока считаем, что если поставщик не указал ни самовывоз, ни доставку, то он доставляет по все России
        this.selectedAddress = location;
      }
    }
  }

  private _watchItemQuantityChanges() {
    this.itemsControls?.forEach((item, ind) => {
      const quantityControl = item.controls.quantity;
      quantityControl.valueChanges
        .pipe(
          tap((_) => (this.isOrderLoading = true)),
          switchMap((orderQuantity) => {
            this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.ORDER_PUT);
            if (orderQuantity < item.controls.orderQtyMin.value) {
              return this._cartService.handleRelation(
                RelationEnumModel.ITEM_REMOVE,
                item.value['_links'][RelationEnumModel.ITEM_REMOVE].href,
              );
            }

            if (orderQuantity % item.controls.orderQtyStep.value !== 0) {
              orderQuantity = orderQuantity - (orderQuantity % item.controls.orderQtyStep.value);
            }

            return this._cartService.handleRelation(
              RelationEnumModel.ITEM_UPDATE_QUANTITY,
              item.value['_links'][RelationEnumModel.ITEM_UPDATE_QUANTITY].href,
              {
                quantity: orderQuantity,
              },
            );
          }),
          catchError((_) => {
            return this._bnetService.getCartDataByCartLocation(this._cartService.getCart$().value).pipe(
              tap((res) => {
                this.cartDataChange.emit(res);
                const foundOrder = this._findOrderInCart(res);
                if (foundOrder) {
                  this._resetOrder(foundOrder);
                }
              }),
            );
          }),
          switchMap((res) => {
            return res ? of(null) : this._bnetService.getCartDataByCartLocation(this._cartService.getCart$().value);
          }),
        )
        .subscribe(
          (res) => {
            if (res) {
              this.cartDataChange.emit(res);
              const foundOrder = this._findOrderInCart(res);
              if (!foundOrder) {
                this.items.clear();
                this._cartService.setActualCartData().pipe(take(1)).subscribe();
                this._cdr.detectChanges();
              }
              if (foundOrder) {
                this._resetOrder(foundOrder);
              }
            }
          },
          (err) => {
            this.isOrderLoading = false;
            this._cdr.detectChanges();
            this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
          },
        );
    });
  }

  private _resetOrder(order) {
    if (order) {
      this.items.clear();
      order.items.forEach((product) => {
        this.items.push(this._createItem(product, this.unavailableToOrderTradeOfferIds));
      });
      this.order.items = order.items;
      this._cartService.partiallyUpdateStorageByOrder(this.order);
      this.isOrderLoading = false;
      this._watchItemQuantityChanges();
      this.form.patchValue({
        total: order.orderTotal?.total,
        totalVat: order.orderTotal?.totalVat,
      });
      this._cdr.detectChanges();
    }
    if (!order) {
      this.items.clear();
      this._cdr.detectChanges();
    }
  }

  private _createOrder() {
    const data = {
      customerOrganizationId: this.form.get('consumerId').value,
      contacts: {
        name: this.form.get('contactName').value,
        phone: `+7${this.form.get('contactPhone').value}`,
        email: this.form.get('contactEmail').value,
      },
      deliveryOptions: {
        ...(this.deliveryAvailable
          ? {
              deliveryTo: {
                fiasCode: this.selectedAddress.fias,
                title: this.selectedAddress.fullName,
                countryOksmCode: '643',
              },
            }
          : {
              pickupFrom: this.pickupArea,
            }),
      },
    };
    let comment = '';
    if (this.form.get('deliveryDesirableDate').value) {
      const dateFormatted = format(new Date(this.form.get('deliveryDesirableDate').value), 'dd-MM-yyyy HH:mm');
      comment += `Желаемая дата доставки: ${dateFormatted}. `;
    }
    if (this.form.get('commentForSupplier').value) {
      comment += `${this.form.get('commentForSupplier').value}`;
    }
    if (comment) {
      data['comment'] = comment;
    }
    const relationHref = this.orderType === 'order' ? RelationEnumModel.ORDER_CREATE : RelationEnumModel.PRICEREQUEST_CREATE;
    this._cartService
      .handleRelation(relationHref, this.orderRelationHref, data)
      .pipe(switchMap((_) => this._cartService.setActualCartData()))
      .subscribe(
        (res) => {
          this._cartModalService.openOrderSentModal();
          this.cartDataChange.emit(res);
          this.items.clear();
          this._cdr.detectChanges();
          this._externalProvidersService.fireYandexMetrikaEvent(
            this.orderType === 'order' ? MetrikaEventTypeModel.ORDER_CREATE : MetrikaEventTypeModel.PRICEREQUEST_CREATE,
          );
        },
        (err) => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );
  }

  private _getDeliveryMethods(opts: DeliveryOptionsModel): Observable<DeliveryMethodModel[]> {
    const deliveryMethods: DeliveryMethodModel[] = [];
    if (opts?.pickupPoints?.length) {
      deliveryMethods.push({ label: 'Самовывоз', value: DeliveryMethod.PICKUP });
    }
    if (opts?.deliveryZones?.length) {
      deliveryMethods.push({ label: 'Доставка', value: DeliveryMethod.DELIVERY });
    }
    if (!deliveryMethods?.length) {
      deliveryMethods.push({ label: 'Доставка', value: DeliveryMethod.DELIVERY });
    }
    return of(deliveryMethods);
  }

  private _initForm(order: CartDataOrderModel, deliveryMethods: DeliveryMethodModel[], userInfo: UserInfoModel): FormGroup {
    return this._fb.group({
      consumerName: new FormControl(''),
      consumerINN: new FormControl(''),
      consumerKPP: new FormControl(''),
      consumerId: new FormControl(''),
      total: new FormControl(order.orderTotal?.total),
      totalVat: new FormControl(order.orderTotal?.totalVat),
      deliveryMethod: new FormControl(deliveryMethods[0]?.value, [Validators.required]),
      deliveryArea: this._createDeliveryAreaForm(),
      pickupArea: new FormControl(order.deliveryOptions?.pickupPoints?.[0]),
      contactName: new FormControl(userInfo?.fullName || '', [Validators.required]),
      contactPhone: new FormControl(userInfo?.phone || '', [Validators.required]),
      contactEmail: new FormControl(userInfo?.email || '', [Validators.required, Validators.email]),
      commentForSupplier: new FormControl(''),
      deliveryDesirableDate: new FormControl(''),
      items: this._fb.array(order.items.map((res) => this._createItem(res, this.unavailableToOrderTradeOfferIds))),
    });
  }

  private _createDeliveryAreaForm(): FormGroup {
    return this._fb.group(
      {
        deliveryCity: new FormControl(''),
        deliveryStreet: new FormControl({ value: '', disabled: true }),
        deliveryHouse: new FormControl({ value: '', disabled: true }),
      },
      {
        // todo Пока создаем и проверяем данные прямо тут в коде, постараться переделать
        // validator:
      },
    );
  }

  private _createItem(product: any, unavailableToOrderTradeOfferIds: string[]): FormGroup {
    const vatConverter = {
      VAT_10: 10,
      VAT_20: 20,
      VAT_WITHOUT: 0,
    };
    const availableToOrder = !unavailableToOrderTradeOfferIds.includes(product.tradeOfferId);
    return this._fb.group({
      tradeOfferId: product.tradeOfferId,
      productName: product.productName,
      productDescription: product.productDescription,
      barCodes: this._fb.array(product?.barCodes || []),
      partNumber: product.partNumber,
      packaging: product.packaging,
      imageUrl: this._setImageUrl(product.imageUrls),
      quantity: product.quantity,
      price: product.price,
      priceIncludesVAT: product.priceIncludesVAT || false,
      maxDaysForShipment: product.maxDaysForShipment,
      orderQtyMin: product.orderQtyMin,
      orderQtyStep: product.orderQtyStep,
      stockAmount: product.stockAmount,
      stockLevel: product.stockLevel,
      nsymb: product.unitOkei?.nsymb,
      availableToOrder: new FormControl(availableToOrder, [Validators.requiredTrue]),
      vat: vatConverter[product.vat] || 0,
      total: product.itemTotal?.total,
      _links: product._links,
    });
  }

  private _setImageUrl(images: string[]): string {
    return images?.length ? absoluteImagePath(images[0]) : './assets/img/svg/clean.svg';
  }

  private _getAvailableOrganizations(userOrganizations: UserOrganizationModel[], order: CartDataOrderModel): UserOrganizationModel[] {
    return !order.customersAudience?.length
      ? userOrganizations
      : userOrganizations?.filter((org) => {
          return this._checkAudienceForAvailability(order.customersAudience, org);
        });
  }

  private _initConsumer(availableOrganizations: UserOrganizationModel[], order: CartDataOrderModel) {
    if (availableOrganizations?.length) {
      if (!order.consumer || !availableOrganizations.map((o) => o.organizationId).includes(order.consumer.id)) {
        if (!order.customersAudience?.length) {
          this.setConsumer(availableOrganizations[0]);
        }
        if (order.customersAudience?.length) {
          const foundUserOrganization = availableOrganizations.find((org) => {
            return this._checkAudienceForAvailability(order.customersAudience, org);
          });
          if (foundUserOrganization) {
            this.setConsumer(foundUserOrganization);
          }
        }
      } else {
        this._setConsumerFromOrder();
      }
    }
  }

  private _checkAudienceForAvailability(audienceArray: any[], org: any) {
    const innKpp = innKppToLegalId(org.legalRequisites.inn, org.legalRequisites.kpp);
    return audienceArray.map((aud) => aud.legalId).includes(innKpp);
  }

  private _setConsumerFromOrder() {
    this.form.patchValue({
      consumerName: this.order.consumer.name,
      consumerINN: this.order.consumer.inn,
      consumerKPP: this.order.consumer.kpp,
      consumerId: this.order.consumer.id,
    });
    this._cartService.partiallyUpdateStorageByOrder(this.order);
  }
}
