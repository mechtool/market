import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CartDataOrderResponseModel, CartDataResponseModel } from '#shared/modules/common-services/models';
import { OrderV2Service } from './order-v2.service';
import { DeliveryMethodModel } from '../order/models';
import { NavigationService } from '#shared/modules';
import { Subscription } from 'rxjs';
import { unsubscribeList } from '#shared/utils';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'market-cart-order-v2',
  templateUrl: './order-v2.component.html',
  styleUrls: [
    './order-v2.component.scss',
    './order-v2.component-768.scss',
    './order-v2.component-576.scss',
  ],
  providers: [OrderV2Service],
})
export class CartOrderV2Component implements OnInit, OnDestroy {
  selectedTab = 0;
  deliveryMethods: DeliveryMethodModel[] = null;

  @Input() order: CartDataOrderResponseModel;
  @Input() positionInCart: number;
  @Output() cartDataChange: EventEmitter<CartDataResponseModel> = new EventEmitter();

  @ViewChild('elementOrder') elementOrder: ElementRef;

  private readonly _cartDataChangeSubscription: Subscription;
  private readonly _selectedTabChangeSubscription: Subscription;

  get isOrderType(): boolean {
    return this._orderV2Service.isOrderType;
  }

  get isAuthenticated(): boolean {
    return this._orderV2Service.isAuthenticated;
  }

  get hasRegisteredOrganizations(): boolean {
    return this._orderV2Service.hasRegisteredOrganizations;
  }

  get isHistoryAvailable() {
    return this._navigationService.history.length > 1;
  }

  get unavailableToOrder(): boolean {
    return this._orderV2Service.unavailableToOrder;
  }

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _orderV2Service: OrderV2Service,
    private _navigationService: NavigationService,
  ) {
    this._cartDataChangeSubscription = this._orderV2Service.cartDataChange$
      .subscribe((cartData) => {
        if (cartData) {
          this.cartDataChange.emit(cartData);
        }
      });

    this._selectedTabChangeSubscription = this._orderV2Service.selectedTabChange$
      .subscribe((index) => {
        if (index && index !== this.selectedTab) {
          this.selectedTab = index;
        }
      });
  }

  ngOnInit(): void {
    this._orderV2Service.init(this.order, this.positionInCart);

    if (this._activatedRoute.snapshot.queryParamMap.get('order') === this.positionInCart.toString()) {
      this.selectedTab = 1;

      this._router.navigate([], {
        queryParams: { order : undefined },
        queryParamsHandling: 'merge'
      });

      setTimeout(() => {
        this.elementOrder?.nativeElement.scrollIntoView({ block: 'start', inline: 'nearest' });
      }, 100);
    }
  }

  ngOnDestroy(): void {
    unsubscribeList([this._cartDataChangeSubscription, this._selectedTabChangeSubscription])
  }

  changeTab(index: number) {
    this._orderV2Service.selectedTabChange$.next(index);

    if (index === 1) {
      this._orderV2Service.proceedToCheckoutMetric();
    }
  }

  validateAndSubmitOrder() {
    this._orderV2Service.validateAndSubmitOrder();
  }

}
