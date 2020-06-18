import { CartDataOrderExtendedModel } from '#shared/modules/common-services/models/cart-data-order-extended.model';
import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CartService, UserService, DeliveryMethod, LocationModel, LocationService, AuthService } from '#shared/modules';
import { map, switchMap, filter } from 'rxjs/operators';
import { stringToHex, absoluteImagePath } from '#shared/utils';
import { deliveryAreaConditionValidator } from '../../validators/delivery-area-condition.validator';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'my-cart-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartOrderComponent implements OnInit {
  @Input() order: CartDataOrderExtendedModel;
  @Input() orderNum: number; // TODO: дб идентификатор для клиента
  @Input() isUserAuthed: boolean;
  form: FormGroup;
  availableUserOrganizations: any[];
  foundLocations: LocationModel[] = [];
  totalItems = 0;
  isModalVisible = false;
  modalType: string = null;
  deliveryTimeIntervals = [
    { label: '9-12', value: '9-12' },
    { label: '12-15', value: '12-15' },
    { label: '15-18', value: '15-18' },
  ];

  // TODO: временно недоступен функционал
  hasSupplierApprovedDeals = false;
  deliveryDescription = 'Доставка осуществляется по Москве и Московской области. Желаемую дату доставки заказа укажите в комментарии к заказу.' +
  'Для доставки на следующий день, заказ необходимо разместить до 15:30 текущего дня. ` Сб-Вс выходной (доставка не работает).' +
  'Минимальная сумма заказа 8 000 руб. с НДС. В контактах, пожалуйста, указывайте прямой, по возможности, мобильный телефон контактного лица.';
  deliveryTime = 'По запросу';
  workingHours = 'понедельник-среда 14.00-15.00';

  deliveryOptions = [];

  get consumerName(): string {
    return this.form.get('consumerName').value.trim();
  }

  get supplierName(): string {
    return this.order.supplier.name.trim();
  }

  get supplierINN(): number {
    return +this.order.supplier.inn;
  }

  get supplierKPP(): number {
    return +this.order.supplier.kpp;
  }

  get supplierPhone(): string {
    return this.order.supplier.phone.trim();
  }

  get supplierEmail(): string {
    return this.order.supplier.email.trim();
  }

  get totalVat(): number {
    return +this.form.get('totalVat').value;
  }

  get vat(): number {
    return +this.form.get('vat').value;
  }

  get deliveryMethod(): string {
    return this.form.get('deliveryMethod').value.trim();
  }

  get pickupPoints(): any[] {
    return this.order.deliveryOptions?.pickupPoints;
  }

  get deliveryAvailable(): boolean {
    return this.deliveryMethod === DeliveryMethod.DELIVERY;
  }

  constructor(
    private _cdr: ChangeDetectorRef,
    private _fb: FormBuilder,
    private _cartService: CartService,
    private _userService: UserService,
    private _locationService: LocationService,
    private _authService: AuthService,
  ) {}

  ngOnInit() {
    this._setDeliveryOptions();
    this._initForm();
    this._setAvailableOrganizationdAndInitConsumer();
    this._watchDeliveryAreaUserChanges();
  }

  createItem(product: any): FormGroup {
    const availabilityConverter =  {
      NoOfferAvailable: 'Нет в наличии',
      TemporarilyOutOfSales: 'Временно снят с продажи',
      AvailableForOrder: 'На складе',
    };

    return this._fb.group({
      productName: product.productName,
      productDescription: product.productDescription,
      barCodes: this._fb.array(product.barCodes),
      partNumber: product.partNumber,
      packaging: product.packaging,
      imageUrl: this._setImageUrl(product.imageUrls),
      quantity: product.quantity,
      price: product.price,
      maxDaysForShipment: product.maxDaysForShipment,
      availabilityStatus: availabilityConverter[product.availabilityStatus] || 'Нет в наличии',
      vat: 20, // TODO: нет данных пока от бекенда
      totalVat: 0, // TODO
      _links: product._links,
    });
  }

  private _setImageUrl(images: string[]): string {
    return images ? absoluteImagePath(images[0]) : absoluteImagePath(null);
  }

  private _watchDeliveryAreaUserChanges() {
    this.form.get('deliveryArea').valueChanges
      .pipe(
        filter(res => typeof res === 'string'),
        switchMap(res => this._locationService.searchLocations(res))
      )
      .subscribe((res) => {
        this.foundLocations = res;
        this._cdr.detectChanges();
      }, (err) => {
        console.error(err);
      });
  }

  makeOrder() {
    this.isModalVisible = true;
    if (this.isUserAuthed) {
      if (this.availableUserOrganizations?.length) {
        const data = {
          customerOrganizationId: this.form.get('consumerId').value,
          contacts: {
            name: this.form.get('contactName').value,
            phone: this.form.get('contactPhone').value,
            email: this.form.get('contactEmail').value,
          },
          deliveryOptions: {
            ...(this.deliveryAvailable ? { deliveryZone: {
              fiasCode: this.form.get('deliveryArea').value.fias,
              title: this.form.get('deliveryArea').value.fullName,
              countryOksmCode: '643',
            } } : { pickupPoint: {
              fiasCode: this.pickupPoints[0].fiasCode,
              title: this.pickupPoints[0].name,
              countryOksmCode: '643',
            } })
          }
        };
        console.log(data);
        this._cartService.handleRelation('https://rels.1cbn.ru/marketplace/make-order', this.order._links['https://rels.1cbn.ru/marketplace/make-order'].href ,data)
          .subscribe((res) => {
            this.modalType ='orderSent';
            this._cdr.detectChanges();
          });
        // this._cartService.handleRelation(this.order._links, data).pipe(
        //   switchMap((res) => {
        //     return this._cartService.setActualCartData();
        //   })
        // ).subscribe();
      }
      if (!this.availableUserOrganizations?.length) {
        this.modalType = 'addOrganization';
        return;
      }
    }
    if (!this.isUserAuthed) {
      this.modalType = 'registerOrAuth';
      return;
    }
  }

  removeFromOrder(orderItem: any) {
    // https://rels.1cbn.ru/marketplace/shopping-cart/remove-item
    this._cartService.handleRelation('https://rels.1cbn.ru/marketplace/shopping-cart/remove-item', orderItem._links.value['https://rels.1cbn.ru/marketplace/shopping-cart/remove-item'].href )
    .subscribe((res) => {
      // this.modalType ='orderSent';
      // this._cdr.detectChanges();
    });
  }

  login(): void {
    this._authService.login(`${location.pathname}${location.search}`);
  }

  register(): void {
    this._authService.register();
  }

  setHexColor(str: string): string {
    return stringToHex(str);
  }

  setConsumer(userOrganization: any): void {
    this.order.consumer = {
      name: userOrganization.organizationName,
      inn: userOrganization.legalRequisites.inn,
      kpp: userOrganization.legalRequisites.kpp,
      id: userOrganization.organizationId,
    };
    this.form.patchValue({
      consumerName: this.order.consumer.name,
      consumerINN: this.order.consumer.inn,
      consumerKPP: this.order.consumer.kpp,
      consumerId: this.order.consumer.id,
    });
    this._cartService.partiallyUpdateStorageByOrder(this.order);
  }

  private _initForm(): void {
    this.form = this._fb.group({
      consumerName: new FormControl(this.order.consumer?.name || ''),
      consumerINN: new FormControl(this.order.consumer?.inn || ''),
      consumerKPP: new FormControl(this.order.consumer?.kpp || ''),
      consumerId: new FormControl(this.order.consumer?.id || ''),
      totalVat: new FormControl(this.order.costSummary.totalVat ),
      vat: new FormControl(this.order.costSummary.vat),
      deliveryMethod: new FormControl(this.deliveryOptions?.[0].value, [Validators.required]),
      deliveryArea: new FormControl(''),
      contactName:  new FormControl('', [Validators.required]),
      contactPhone:  new FormControl('', [Validators.required]),
      contactEmail:  new FormControl('', [Validators.required]),
      commentForSupplier:  new FormControl(''),
      deliveryDesirableDate:  new FormControl(''),
      deliveryDesirableTimeInterval:  new FormControl(''),
      items: this._fb.array(this.order.items.map((res) => {
        return this.createItem(res);
      })),
    }, { validator: deliveryAreaConditionValidator});
  }

  locationsCompareFun = (o1: any | string, o2: any) => {
    if (o1) {
      return typeof o1 === 'string' ? o1 === o2.fullName : o1.fias === o2.fias;
    }
    return false;
  };

  private _setAvailableOrganizationdAndInitConsumer() {
    this._userService.userOrganizations$.pipe(
      filter(res => !!res),
      map((res) => {
        if (!Array.isArray(this.order.customersAudience) || !this.order.customersAudience.length) {
          this.availableUserOrganizations = res;
        }
        else {
          this.availableUserOrganizations = res.filter((org) => {
            return this.order.customersAudience.includes(org.legalRequisites.inn + `${org.legalRequisites.kpp ? `:${org.legalRequisites.kpp}` : ''}`);
          })
        }
        if (!this.order.consumer && this.availableUserOrganizations?.length) {
          this.setConsumer(this.availableUserOrganizations[0]);
        }
        this._cdr.detectChanges();
      })
    ).subscribe();
  }

  private _setDeliveryOptions() {
    if (this.order.deliveryOptions?.pickupPoints?.length) {
      this.deliveryOptions.push({ label: 'Самовывоз', value: DeliveryMethod.PICKUP });
    }
    if (this.order.deliveryOptions?.deliveryZones?.length) {
      this.deliveryOptions.push({ label: 'Доставка', value: DeliveryMethod.DELIVERY });
    }
  }

}

