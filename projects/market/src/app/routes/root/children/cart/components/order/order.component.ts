import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CartDataOrderResponseModel, CartDataResponseModel } from '#shared/modules/common-services/models';
import { OrderService } from './order.service';
import { DeliveryMethodModel } from './models';
import { NavigationService } from '#shared/modules';
import { Subscription } from 'rxjs';
import { unsubscribeList } from '#shared/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'market-cart-order',
  templateUrl: './order.component.html',
  styleUrls: [
    './order.component.scss',
    './order.component-768.scss',
    './order.component-576.scss',
  ],
  providers: [OrderService],
})
export class CartOrderComponent implements OnInit, OnDestroy {
  selectedTab = 0;
  deliveryMethods: DeliveryMethodModel[] = null;

  @Input() order: CartDataOrderResponseModel;
  @Input() positionInCart: number;
  @Output() cartDataChange: EventEmitter<CartDataResponseModel> = new EventEmitter();

  @ViewChild('elementOrder') elementOrder: ElementRef;

  private readonly _cartDataChangeSubscription: Subscription;
  private readonly _selectedTabChangeSubscription: Subscription;

  get form(): FormGroup {
    return this._orderService.form;
  }

  get isOrderType(): boolean {
    return this._orderService.isOrderType;
  }

  get isAuthenticated(): boolean {
    return this._orderService.isAuthenticated;
  }

  get hasRegisteredOrganizations(): boolean {
    return this._orderService.hasRegisteredOrganizations;
  }

  get isHistoryAvailable() {
    return this._navigationService.history.length > 1;
  }

  get unavailableToOrder(): boolean {
    return this._orderService.unavailableToOrder;
  }

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _orderService: OrderService,
    private _navigationService: NavigationService,
  ) {
    this._cartDataChangeSubscription = this._orderService.cartDataChange$
      .subscribe((cartData) => {
        if (cartData) {
          this.cartDataChange.emit(cartData);
        }
      });

    this._selectedTabChangeSubscription = this._orderService.selectedTabChange$
      .subscribe((index) => {
        if (index && index !== this.selectedTab) {
          this.selectedTab = index;
        }
      });
  }

  ngOnInit(): void {
    this._orderService.init(this.order, this.positionInCart);

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
    this._orderService.selectedTabChange$.next(index);

    if (index === 1) {
      this._orderService.proceedToCheckoutMetric();
    }
  }

  validateAndSubmitOrder() {
    this._orderService.validateAndSubmitOrder();
  }

}
