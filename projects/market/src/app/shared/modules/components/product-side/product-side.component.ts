import { UntilDestroy } from '@ngneat/until-destroy';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MetrikaEventTypeModel,
  OrderStatusModal,
  RelationEnumModel,
  TradeOfferResponseModel,
} from '#shared/modules/common-services/models';
import { CartService, ExternalProvidersService, NotificationsService } from '#shared/modules/common-services';
import { filter, map, startWith, tap } from 'rxjs/operators';
import { combineLatest, defer, fromEvent, merge, Observable, of } from 'rxjs';
import { currencyCode } from '#shared/utils';

enum Operation {
  REMOVE,
  ADD,
}

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-product-side',
  templateUrl: './product-side.component.html',
  styleUrls: ['./product-side.component.scss'],
})
export class ProductSideComponent implements OnInit, AfterViewInit {
  @ViewChild('inputEl') inputEl: ElementRef;
  @Input() tradeOffer: TradeOfferResponseModel;
  @Input() minQuantity: number;
  @Input() orderStep: number;
  @Output() isMadeOrder: EventEmitter<boolean> = new EventEmitter();
  orderStatus: OrderStatusModal;
  form: FormGroup;
  isAdded: boolean;
  prevCount: number = null;

  get tradeOfferId(): string {
    return this.tradeOffer?.id;
  }

  constructor(
    private _fb: FormBuilder,
    private _cartService: CartService,
    private _notificationsService: NotificationsService,
    private _cdr: ChangeDetectorRef,
    private _externalProvidersService: ExternalProvidersService,
  ) {
    this.form = this._fb.group({
      totalPositions: 0,
    });
  }

  ngAfterViewInit() {
    this._changeTotalPositions();
  }

  private _inputIsFocused$(): Observable<boolean> {
    let elementQuery = null;
    let elementQueryFocusChanges$ = null;
    let elementQueryBlurChanges$ = null;
    if (this.inputEl?.nativeElement) {
      elementQuery = this.inputEl.nativeElement;
      elementQueryFocusChanges$ = fromEvent(elementQuery, 'focus');
      elementQueryBlurChanges$ = fromEvent(elementQuery, 'blur');
    }

    return defer(() => {
      return !elementQuery
        ? of(false)
        : merge(elementQueryFocusChanges$, elementQueryBlurChanges$).pipe(
          map((event: FocusEvent) => {
            return event.type === 'focus';
          }),
        );
    });
  }

  ngOnInit(): void {
    this._cartService.getCartData$().subscribe(
      (cartData) => {
        const cartTradeOffers = cartData.content?.reduce((accum, curr) => {
          return [...curr.items, ...accum];
        }, []);
        const foundTradeOffer = cartTradeOffers.find((order) => {
          return order.tradeOfferId === this.tradeOfferId;
        });
        if (foundTradeOffer) {
          this.orderStatus = OrderStatusModal.IN_CART;
          this.form.controls.totalPositions.setValue(foundTradeOffer.quantity, { onlySelf: true, emitEvent: false });
        } else {
          this.orderStatus = OrderStatusModal.TO_CART;
          this.form.controls.totalPositions.setValue(null, { onlySelf: true, emitEvent: false });
        }
      },
      (err) => {
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      },
    );
  }

  decrease() {
    this.form.patchValue({ totalPositions: this.form.get('totalPositions').value - this.orderStep });
  }

  increase() {
    this.form.patchValue({ totalPositions: this.form.get('totalPositions').value + this.orderStep });
  }

  addToCart() {
    this.isAdded = true;
    this.form.controls.totalPositions.setValue(this.minQuantity, { onlySelf: true, emitEvent: false });
    this.orderStatus = OrderStatusModal.IN_CART;
    const cartLocation = this._cartService.getCart$().value;
    this._cartService
      .handleRelationAndUpdateData(RelationEnumModel.ITEM_ADD, `${cartLocation}/items`, {
        tradeOfferId: this.tradeOfferId,
        quantity: this.minQuantity,
      })
      .pipe(
        tap(() => {
          const tag = {
            event: 'addToCart',
            ecommerce: {
              currencyCode: this.tradeOffer.termsOfSale?.price?.currencyCode
                ? currencyCode(this.tradeOffer.termsOfSale.price.currencyCode)
                : 'RUB',
              add: {
                products: [
                  {
                    name:
                      this.tradeOffer.product?.ref1cNomenclature?.productName ||
                      this.tradeOffer.product?.supplierNomenclature?.productName ||
                      '',
                    id: this.tradeOfferId || '',
                    price: this.tradeOffer.termsOfSale?.price?.matrix?.[0]?.price
                      ? this.tradeOffer.termsOfSale.price.matrix[0].price / 100
                      : '',
                    brand:
                      this.tradeOffer.product?.ref1cNomenclature?.manufacturer?.tradeMark ||
                      this.tradeOffer.product?.supplierNomenclature?.manufacturer?.tradeMark ||
                      '',
                    category:
                      this.tradeOffer.product?.ref1cNomenclature?.categoryName ||
                      this.tradeOffer.product?.supplierNomenclature?.ref1Cn?.categoryName ||
                      '',
                    variant: this.tradeOffer.supplier?.name || '',
                    dimension1: this.tradeOffer.offerDescription?.description || '',
                  },
                ],
              },
            },
          };
          this._externalProvidersService.fireGTMEvent(tag);
          this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.ORDER_PUT).subscribe();
        }),
      )
      .subscribe(
        () => {
          this.spinnerOf();
          this.isMadeOrder.emit(true);
          this._cdr.detectChanges();
        },
        (err) => {
          this._notificationsService.error('Невозможно добавить товар в корзину. Внутренняя ошибка сервера.');
          this.isMadeOrder.emit(false);
          this.rollBackTotalPositions(Operation.ADD);
        },
      );
  }

  private _changeTotalPositions() {
    return combineLatest([this._inputIsFocused$().pipe(startWith(false)), this.form.controls.totalPositions.valueChanges])
      .pipe(filter(([isFocused]) => isFocused === false))
      .subscribe(([, value]) => {
        const cartLocation = this._cartService.getCart$()?.getValue();

        if (value >= this.minQuantity && value !== this.prevCount) {
          if (value % this.orderStep !== 0) {
            /* todo Возможно данный блок нужно будет переделать, решить после закрытия задачи BNET-3597 */
            value = value - (value % this.orderStep);
            this.form.controls.totalPositions.setValue(value, { onlySelf: true, emitEvent: false });
          }
          this.isAdded = true;
          this._cartService
            .handleRelationAndUpdateData(RelationEnumModel.ITEM_UPDATE_QUANTITY, `${cartLocation}/items/${this.tradeOfferId}/quantity`, {
              quantity: value,
            })
            .pipe(
              tap(() => {
                this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.ORDER_PUT).subscribe();
              }),
            )
            .subscribe(
              () => {
                this.spinnerOf();
                this.isMadeOrder.emit(true);
                this.prevCount = value;
              },
              (err) => {
                this._notificationsService.error('Невозможно изменить количество товаров. Внутренняя ошибка сервера.');
                this.isMadeOrder.emit(false);
                this.rollBackTotalPositions();
              },
            );
        }
        if (!value || value < this.minQuantity) {
          this.orderStatus = OrderStatusModal.TO_CART;
          this._cartService
            .handleRelationAndUpdateData(RelationEnumModel.ITEM_REMOVE, `${cartLocation}/items/${this.tradeOfferId}`)
            .pipe(
              tap(() => {
                this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.ORDER_PUT).subscribe();
              }),
            )
            .subscribe(
              () => {
                this.prevCount = value;
                this.isMadeOrder.emit(false);
              },
              (err) => {
                this._notificationsService.error('Невозможно удалить товар из корзины. Внутренняя ошибка сервера.');
                this.isMadeOrder.emit(false);
                this.rollBackTotalPositions(Operation.REMOVE);
              },
            );
        }
      });
  }

  private rollBackTotalPositions(operation?: Operation) {
    this.spinnerOf();
    if (operation === Operation.REMOVE) {
      this.orderStatus = OrderStatusModal.IN_CART;
      this._cdr.detectChanges();
      this.form.controls.totalPositions.setValue(this.minQuantity, { onlySelf: true, emitEvent: false });
    } else if (operation === Operation.ADD) {
      this.orderStatus = OrderStatusModal.TO_CART;
      this.form.controls.totalPositions.setValue(0, { onlySelf: true, emitEvent: false });
      this._cdr.detectChanges();
    } else {
      const order = this.orderedProduct();
      if (order) {
        this.orderStatus = OrderStatusModal.IN_CART;
        this.form.controls.totalPositions.setValue(order.quantity, { onlySelf: true, emitEvent: false });
        this._cdr.detectChanges();
      }
    }
  }

  private orderedProduct(): any {
    const cartTradeOffers = this._cartService
      .getCartData$()
      .getValue()
      .content?.reduce((accum, curr) => {
        return [...curr.items, ...accum];
      }, []);
    return cartTradeOffers.find((order) => {
      return order.tradeOfferId === this.tradeOfferId;
    });
  }

  private spinnerOf() {
    this.isAdded = false;
    this._cdr.detectChanges();
  }
}
