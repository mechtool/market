import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  CartDataOrderModel,
  DeliveryMethod,
  LocationModel,
  RelationEnumModel
} from '#shared/modules/common-services/models';
import { catchError, filter, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import format from 'date-fns/format';
import { absoluteImagePath, stringToHex, innKppToLegalId } from '#shared/utils';
import { deliveryAreaConditionValidator } from '../../validators/delivery-area-condition.validator';
import { iif, of } from 'rxjs';
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

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-cart-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartOrderComponent implements OnInit, OnDestroy {
  @Input() order: CartDataOrderModel;
  @Input() userData: boolean;
  @Output() cartDataChange: EventEmitter<any> = new EventEmitter();
  form: FormGroup;
  availableUserOrganizations: any[];
  foundLocations: LocationModel[] = [];
  isModalVisible = false;
  modalType: string = null;
  deliveryTimeIntervals = [
    { label: '9-12', value: '9-12' },
    { label: '12-15', value: '12-15' },
    { label: '15-18', value: '15-18' },
  ];
  isOrderLoading = false;
  deliveryOptions = [];
  selectedTabIndex = 0;

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

  get totalCost(): number {
    return +this.form.get('totalCost').value;
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

  get orderRelationHref(): string {
    return this.order._links?.[RelationEnumModel.ORDER_CREATE]?.href;
  }

  constructor(
    private _cdr: ChangeDetectorRef,
    private _fb: FormBuilder,
    private _cartService: CartService,
    private _userService: UserService,
    private _locationService: LocationService,
    private _authService: AuthService,
    private _bnetService: BNetService,
    private _router: Router,
    private _tradeOffersService: TradeOffersService,
    private _notificationsService: NotificationsService,
  ) {
  }

  ngOnInit() {
    this._setDeliveryOptions();
    this._initForm();
    this._setAvailableOrganizationdAndInitConsumer();
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

  private _watchDeliveryAreaUserChanges() {
    this.form.get('deliveryArea').valueChanges
      .pipe(
        filter(res => typeof res === 'string'),
        mergeMap((v) => {
          return iif(() => {
            return !this.order.deliveryOptions.deliveryZones;
          },
          this._locationService.searchLocations(v),
          this._locationService.searchAddresses(v, this.order.deliveryOptions.deliveryZones.map(zone => zone.fiasCode)));
        }),
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
    this.form.get('items')['controls'].forEach((ctrl, ind) => {

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
          if (!this.items?.length) {
            this._cartService.setActualCartData().subscribe();
          }
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
        this.items.push(this._createItem(product));
      });
      this.order.items = order.items;
      this._cartService.partiallyUpdateStorageByOrder(this.order);
      this.isOrderLoading = false;
      this._watchItemQuantityChanges();
      this.form.patchValue({
        totalCost: order.orderTotal.total,
        totalVat: order.orderTotal.totalVat,
      });
      this._cdr.detectChanges();
    }
    if (!order) {
      this.items.clear();
      this._cdr.detectChanges();
    }
  }

  checkAndCreateOrder() {
    if (this.form.valid) {
      this._createOrder();
    }
    if (!this.form.valid) {
      this.selectedTabIndex = 1;
      Object.keys(this.form.controls).forEach(key => {
        this.form.controls[key].markAsDirty();
       });
    }
  }

  changeSelectedTabIndex(tabIndex: number) {
    this.selectedTabIndex = tabIndex;
  }

  private _createOrder() {
    if (!this.orderRelationHref) {
      return;
    }
    if (!!this.userData) {
      if (this.availableUserOrganizations?.length) {
        const data = {
          customerOrganizationId: this.form.get('consumerId').value,
          contacts: {
            name: this.form.get('contactName').value,
            phone: this.form.get('contactPhone').value,
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
        let comments = '';
        if (this.form.get('deliveryDesirableDate').value) {
          const dateFormatted = format(
            new Date(this.form.get('deliveryDesirableDate').value),
            'dd-MM-yyyy HH:mm'
          );
          comments += `Желаемая дата доставки: ${dateFormatted}
          `;
        }
        if (this.form.get('commentForSupplier').value) {
          comments += `Комментарий: ${this.form.get('commentForSupplier').value}
          `;
        }
        if (comments) {
          data['comments'] = comments;
        }
        this._cartService.handleRelation(RelationEnumModel.ORDER_CREATE, this.orderRelationHref, data)
          .pipe(
            switchMap(_ => this._cartService.setActualCartData())
          )
          .subscribe(
            (res) => {
              this.isModalVisible = true;
              this.modalType = 'orderSent';
              this.cartDataChange.emit(res);
              this.items.clear();
              this._cdr.detectChanges();
            },
            (err) => {
              this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
            });
      }
      if (!this.availableUserOrganizations?.length) {
        this.isModalVisible = true;
        this.modalType = 'addOrganization';
        return;
      }
    }
    if (!this.userData) {
      this.isModalVisible = true;
      this.modalType = 'registerOrAuth';
      return;
    }
  }

  login(): void {
    this._authService.login(`${location.pathname}${location.search}`);
  }

  register(): void {
    this._authService.register('/my/organizations?tab=c');
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

  private _setDeliveryOptions() {
    if (this.order.deliveryOptions?.pickupPoints?.length) {
      this.deliveryOptions.push({ label: 'Самовывоз', value: DeliveryMethod.PICKUP });
    }
    if (this.order.deliveryOptions?.deliveryZones?.length) {
      this.deliveryOptions.push({ label: 'Доставка', value: DeliveryMethod.DELIVERY });
    }
    if (!this.deliveryOptions?.length) {
      this.deliveryOptions.push({ label: 'Доставка', value: DeliveryMethod.DELIVERY });
    }
  }

  private _initForm(): void {
    this.form = this._fb.group({
      consumerName: new FormControl(''),
      consumerINN: new FormControl(''),
      consumerKPP: new FormControl(''),
      consumerId: new FormControl(''),
      totalCost: new FormControl(this.order.orderTotal?.total),
      totalVat: new FormControl(this.order.orderTotal?.totalVat),
      deliveryMethod: new FormControl(this.deliveryOptions?.[0]?.value, [Validators.required]),
      deliveryArea: new FormControl(''),
      pickupArea: new FormControl(this.order.deliveryOptions?.pickupPoints?.[0]),
      contactName: new FormControl(this.userData?.['userInfo']?.fullName || '', [Validators.required]),
      contactPhone: new FormControl(this.userData?.['userInfo']?.phone || '', [Validators.required]),
      contactEmail: new FormControl(this.userData?.['userInfo']?.email || '', [Validators.required, Validators.email]),
      commentForSupplier: new FormControl(''),
      deliveryDesirableDate: new FormControl(''),
      items: this._fb.array(this.order.items.map(res => this._createItem(res))),
    }, { validator: deliveryAreaConditionValidator });
  }

  private _createItem(product: any): FormGroup {
    const vatConverter = {
      VAT_10: 10,
      VAT_20: 20,
      VAT_WITHOUT: 0,
    };
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
      maxDaysForShipment: product.maxDaysForShipment,
      availabilityStatus: new FormControl(product.availabilityStatus, [Validators.pattern(/^(AvailableForOrder)$/)]),
      vat: vatConverter[product.vat] || 0,
      totalCost: product.itemTotal?.total,
      _links: product._links,
    });
  }

  private _setImageUrl(images: string[]): string {
    return images?.length ? absoluteImagePath(images[0]) : null;
  }

  private _setAvailableOrganizationdAndInitConsumer() {
    this._userService.userOrganizations$.pipe(
      filter(res => !!res),
      map((res) => {
        this._setAvailableOrganizations(res);
        this._initConsumer();
        this._cdr.detectChanges();
      })
    ).subscribe();
  }

  private _setAvailableOrganizations(userOrganizations: any[]) {
    if (!this.order.customersAudience?.length) {
      this.availableUserOrganizations = userOrganizations;
    }
    if (this.order.customersAudience?.length) {
      this.availableUserOrganizations = userOrganizations.filter((org) => {
        return this._checkAudienceForAvailability(this.order.customersAudience, org);
      });
    }
  }

  private _initConsumer() {
    if (this.availableUserOrganizations?.length) {

      if (!this.order.consumer || (this.order.consumer && !this.availableUserOrganizations.map(o => o.organizationId).includes(this.order.consumer.id))) {
        if (!this.order.customersAudience?.length) {
          this.setConsumer(this.availableUserOrganizations[0]);
        }
        if (this.order.customersAudience?.length) {
          const foundUserOrganization = this.availableUserOrganizations.find((org) => {
            return this._checkAudienceForAvailability(this.order.customersAudience, org);
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

