import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {
  CartDataOrderModel,
  DeliveryMethod,
  LocationModel,
  RelationEnumModel,
  UserOrganizationModel,
  CountryCode
} from '#shared/modules/common-services/models';
import { catchError, filter, map, mergeMap, switchMap, take, tap, debounceTime } from 'rxjs/operators';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import format from 'date-fns/format';
import { absoluteImagePath, stringToHex, innKppToLegalId } from '#shared/utils';
import { deliveryAreaConditionValidator } from '../../validators/delivery-area-condition.validator';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import {
  AuthService,
  BNetService,
  CartService,
  LocationService,
  NotificationsService,
  TradeOffersService,
  UserService,
} from '#shared/modules/common-services';
import { DeliveryMethodModel } from './models/delivery-method.model';
import { UserInfoModel } from '#shared/modules/common-services/models/user-info.model';
import { AuthModalService } from '#shared/modules/setup-services/auth-modal.service';
import { CartModalService } from '../../cart-modal.service';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-cart-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartOrderComponent implements OnInit, OnDestroy {
  @Input() order: CartDataOrderModel;
  @Input() userInfo: UserInfoModel;
  @Output() cartDataChange: EventEmitter<any> = new EventEmitter();
  form: FormGroup;
  availableUserOrganizations: UserOrganizationModel[];
  foundLocations: LocationModel[] = null;
  isOrderLoading = false;
  deliveryMethods: DeliveryMethodModel[] = null;
  selectedTabIndex = 0;

  get orderType(): 'order' | 'priceRequest' {
    return this.order?.items?.[0]?.price ? 'order' : 'priceRequest';
  }

  get unavailableToOrderTradeOfferIds(): string[] {
    const unavailableToOrderStatuses = ['TemporarilyOutOfSales'];
    return this.order.makeOrderViolations?.filter(x => unavailableToOrderStatuses.includes(x.code)).map(x => x.tradeOfferId) || [];
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
    return this.order._links?.[RelationEnumModel.ORDER_CREATE]?.href;
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
  ) {
  }

  ngOnInit() {
    this.deliveryMethods = this._getDeliveryMethods(this.order.deliveryOptions);
    this.form = this._initForm(this.order, this.deliveryMethods, this.userInfo);
    this.availableUserOrganizations = this._getAvailableOrganizations(this._userService.userOrganizations$.value, this.order);
    this._initConsumer(this.availableUserOrganizations, this.order);
    this.foundLocations = this._getFoundLocations(this.order);
    this._cdr.detectChanges();
    this._watchDeliveryAreaUserChanges();
    this._watchItemQuantityChanges();
  }

  ngOnDestroy() {
    this._cartService.pullStorageCartData();
  }

  setPickupArea(pickupPoint) {
    this.form.patchValue({
      pickupArea: pickupPoint,
    });
  }

  private _getFoundLocations(order: CartDataOrderModel): LocationModel[] {
    if (order.deliveryOptions?.deliveryZones?.every(zone => zone.fiasCode)) {
      return order.deliveryOptions.deliveryZones.map((zone: any) => {
        return {
          fias: zone.fiasCode,
          name: zone.title,
          fullName: zone.title,
        };
      });
    }
    return [{
      fias: CountryCode.RUSSIA,
      name: 'Россия',
      fullName: 'Российская Федерация',
    }];
  }

  private _watchDeliveryAreaUserChanges() {
    this.form.get('deliveryArea').valueChanges
      .pipe(
        filter(res => typeof res === 'string'),
        debounceTime(300),
        switchMap((res) => {
          let deliveryZones = null;
          if (this.order.deliveryOptions?.deliveryZones?.every(zone => zone.fiasCode)) {
            deliveryZones = this.order.deliveryOptions.deliveryZones;
          }
          if (deliveryZones?.length) {
            return this._locationService.searchAddresses(res, deliveryZones);
          }
          return this._locationService.searchAddresses(res);
        })
      )
      .subscribe(
        (res) => {
          this.foundLocations = res;
          this._cdr.detectChanges();
        },
        (err) => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        });
  }

  private _watchItemQuantityChanges() {
    this.itemsControls.forEach((ctrl, ind) => {

      const quantityControl = ctrl.controls.quantity;
      quantityControl.valueChanges
        .pipe(
          tap(_ => this.isOrderLoading = true),
          switchMap((res) => {
            return res === 0 ? this._cartService.handleRelation(
              RelationEnumModel.ITEM_REMOVE,
              ctrl.value['_links'][RelationEnumModel.ITEM_REMOVE].href
              ) :
              this._cartService.handleRelation(
                RelationEnumModel.ITEM_UPDATE_QUANTITY,
                ctrl.value['_links'][RelationEnumModel.ITEM_UPDATE_QUANTITY].href,
                {
                  quantity: res,
                }
              );
          }),
          catchError((_) => {
            return this._bnetService.getCartDataByCartLocation(this._cartService.getCart$().value).pipe(
              tap((res) => {
                this.cartDataChange.emit(res);
                const foundOrder = res.content.find((x) => {
                  return this.orderRelationHref && x._links?.[RelationEnumModel.ORDER_CREATE]?.href === this.orderRelationHref;
                });
                if (foundOrder) {
                  this._resetOrder(foundOrder);
                }
              })
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
              const foundOrder = res.content.find((x) => {
                return this.orderRelationHref && x._links?.[RelationEnumModel.ORDER_CREATE]?.href === this.orderRelationHref;
              });
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
          });
    });
  }

  removeItem(orderItem: any, i: any) {
    if (this.isOrderLoading) {
      return;
    }
    this.isOrderLoading = true;
    this._cartService.handleRelation(
      RelationEnumModel.ITEM_REMOVE,
      orderItem._links.value[RelationEnumModel.ITEM_REMOVE].href
    )
      .pipe(
        catchError((err) => {
          return this._bnetService.getCartDataByCartLocation(this._cartService.getCart$().value).pipe(
            tap((res) => {
              this.cartDataChange.emit(res);
              const foundOrder = res.content.find((x) => {
                return this.orderRelationHref && x._links?.[RelationEnumModel.ORDER_CREATE]?.href === this.orderRelationHref;
              });
              if (foundOrder) {
                this._resetOrder(foundOrder);
              }
            })
          );
        }),
        switchMap((res) => {
          return res ? of(null) : this._bnetService.getCartDataByCartLocation(this._cartService.getCart$().value);
        })
      )
      .subscribe(
        (res) => {
          this.cartDataChange.emit(res);
          if (res) {
            const foundOrder = res.content.find((x) => {
              return this.orderRelationHref && x._links?.[RelationEnumModel.ORDER_CREATE]?.href === this.orderRelationHref;
            });
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

  checkForValidityAndCreateOrder() {

    if (!this.userInfo) {
      this._authModalService.openAuthDecisionMakerModal();
      return;
    }

    if (!this.availableUserOrganizations?.length) {
      this._authModalService.openEmptyOrganizationsInfoModal();
      return;
    }

    if (!this.orderRelationHref) {
      this.changeSelectedTabIndex(0);
      this._cartModalService.openOrderUnavailableModal();
      return;
    }

    if (!this.form.valid) {
      this.changeSelectedTabIndex(1);
      Object.keys(this.form.controls).forEach(key => {
        this.form.controls[key].markAsDirty();
      });
      return;
    }

    this._createOrder();

  }

  changeSelectedTabIndex(tabIndex: number) {
    this.selectedTabIndex = tabIndex;
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
        ...(this.deliveryAvailable ? {
          deliveryTo: {
            fiasCode: this.form.get('deliveryArea').value.fias,
            title: this.form.get('deliveryArea').value.fullName,
            countryOksmCode: '643',
          }
        } : {
          pickupFrom: this.pickupArea,
        })
      }
    };
    let comment = '';
    if (this.form.get('deliveryDesirableDate').value) {
      const dateFormatted = format(
        new Date(this.form.get('deliveryDesirableDate').value),
        'dd-MM-yyyy HH:mm'
      );
      comment += `Желаемая дата доставки: ${dateFormatted}
      `;
    }
    if (this.form.get('commentForSupplier').value) {
      comment += `Комментарий: ${this.form.get('commentForSupplier').value}`;
    }
    if (comment) {
      data['comment'] = comment;
    }
    this._cartService.handleRelation(RelationEnumModel.ORDER_CREATE, this.orderRelationHref, data)
      .pipe(
        switchMap(_ => this._cartService.setActualCartData())
      )
      .subscribe(
        (res) => {
          this._cartModalService.openOrderSentModal();
          this.cartDataChange.emit(res);
          this.items.clear();
          this._cdr.detectChanges();
        },
        (err) => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        });
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
        }
      },
    });
  }

  goToTradeOffer(tradeOfferId: string) {
    if (tradeOfferId) {
      this._tradeOffersService.get(tradeOfferId)
        .subscribe(
          (res) => {
            const supplierId = res.supplier?.bnetInternalId;
            if (supplierId) {
              this._router.navigate([`./supplier/${supplierId}/offer/${tradeOfferId}`]);
            }
            if (!supplierId) {
              console.log('Не удалось получить поставщика по ТП');
            }
          },
          (err) => {
            this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
          });
    }
    if (!tradeOfferId) {
      console.log('Отсутствует идентификатор ТП');
    }
  }

  disabledDate (current: Date): boolean {
    return differenceInCalendarDays(current, new Date()) < 1;
  };

  private _getDeliveryMethods(opts: {
    pickupPoints?: {
      fiasCode: string;
      title: string;
      countryOksmCode: string;
    }[];
    deliveryZones?: {
      fiasCode: string;
      title: string;
      countryOksmCode: string;
    }[];
  }): DeliveryMethodModel[] {
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
    return deliveryMethods;
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
      deliveryArea: new FormControl(''),
      pickupArea: new FormControl(order.deliveryOptions?.pickupPoints?.[0]),
      contactName: new FormControl(userInfo?.fullName || '', [Validators.required]),
      contactPhone: new FormControl(userInfo?.phone || '', [Validators.required]),
      contactEmail: new FormControl(userInfo?.email || '', [Validators.required, Validators.email]),
      commentForSupplier: new FormControl(''),
      deliveryDesirableDate: new FormControl(''),
      items: this._fb.array(order.items.map(res => this._createItem(res, this.unavailableToOrderTradeOfferIds))),
    }, { validator: deliveryAreaConditionValidator });
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
      availableToOrder: new FormControl(availableToOrder, [Validators.requiredTrue]),
      vat: vatConverter[product.vat] || 0,
      total: product.itemTotal?.total,
      _links: product._links,
    });
  }

  private _setImageUrl(images: string[]): string {
    return images?.length ? absoluteImagePath(images[0]) : null;
  }

  private _getAvailableOrganizations(userOrganizations: UserOrganizationModel[], order: CartDataOrderModel): UserOrganizationModel[] {
    return !order.customersAudience?.length ?
      userOrganizations : userOrganizations?.filter((org) => {
        return this._checkAudienceForAvailability(order.customersAudience, org);
      });
  }

  private _initConsumer(availableOrganizations: UserOrganizationModel[], order: CartDataOrderModel) {
    if (availableOrganizations?.length) {

      if (!order.consumer || (order.consumer && !availableOrganizations.map(o => o.organizationId).includes(order.consumer.id))) {
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
      }

      else {
        this._setConsumerFromOrder();
      }
    }
  }

  private _checkAudienceForAvailability(audienceArray: any[], org: any) {
    const innKpp = innKppToLegalId(org.legalRequisites.inn, org.legalRequisites.kpp);
    return audienceArray.map(aud => aud.id).includes(innKpp);
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

