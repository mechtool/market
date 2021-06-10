import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DeliveryMethodModel } from '../../models';
import { OrderService } from '../../order.service';
import { Subscription } from 'rxjs';
import { unsubscribeList } from '#shared/utils';
import { AuthService } from '#shared/modules';
import { Router } from '@angular/router';

@Component({
  selector: 'market-order-details-without-auth',
  templateUrl: './order-details-without-auth.component.html',
  styleUrls: [
    './order-details-without-auth.component.scss',
    './order-details-without-auth.component-576.scss',
  ],
})
export class OrderDetailsWithoutAuthComponent implements OnDestroy {
  currentDate = Date.now();

  @ViewChild('elementInputInn') elementInputInn: ElementRef;
  @ViewChild('elementInputKpp') elementInputKpp: ElementRef;
  @ViewChild('elementInputName') elementInputName: ElementRef;
  @ViewChild('elementTextarea') elementTextarea: ElementRef;
  @ViewChild('elementInputCity') elementInputCity: ElementRef;
  @ViewChild('elementInputContactName') elementInputContactName: ElementRef;
  @ViewChild('elementInputContactPhone') elementInputContactPhone: ElementRef;
  @ViewChild('elementInputContactEmail') elementInputContactEmail: ElementRef;
  @ViewChild('elementIsOrganizationAgent') elementIsOrganizationAgent: ElementRef;

  private readonly _focusSubscription: Subscription;

  get form(): FormGroup {
    return this._orderService.form;
  }

  get foundCities$() {
    return this._orderService.foundCities$;
  }

  get isAnonymous(): boolean {
    return this._orderService.isAnonymous;
  }

  get availableOrganizations() {
    return this._orderService.availableOrganizations;
  }

  get pickupPoints(): any[] {
    return this._orderService.pickupPoints;
  }

  get deliveryZones(): any[] {
    return this._orderService.deliveryZones;
  }

  get deliveryMethods(): DeliveryMethodModel[] {
    return this._orderService.deliveryMethods;
  }

  get selectedDelivery(): boolean {
    return this._orderService.selectedDelivery;
  }

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _orderService: OrderService,
  ) {
    this._focusSubscription = this._orderService.focus$
      .subscribe((element) => {
        if (element === 'city') {
          this.elementTextarea?.nativeElement.focus();
        }
        if (element === 'contactName') {
          this.elementInputContactName?.nativeElement.focus();
        }
        if (element === 'emailError') {
          this.elementInputContactEmail?.nativeElement.focus();
        }
        if (element === 'phoneError') {
          this.elementInputContactPhone?.nativeElement.focus();
        }
        if (element === 'nameError') {
          this.elementInputContactName?.nativeElement.focus();
        }
        if (element === 'consumerInnError') {
          this.elementInputInn?.nativeElement.focus();
        }
        if (element === 'consumerKppError') {
          this.elementInputKpp?.nativeElement.focus();
        }
        if (element === 'consumerNameError') {
          this.elementInputName?.nativeElement.focus();
        }
        if (element === 'deliveryError') {
          this.elementInputCity?.nativeElement.focus();
        }
        if (element === 'organizationAgentError') {
          this.elementIsOrganizationAgent?.nativeElement.scrollIntoView({ block: 'center', inline: 'nearest' });
        }
      });
  }

  ngOnDestroy(): void {
    unsubscribeList([this._focusSubscription]);
  }

  auth() {
    this._orderService.authMetric();

    this._router.navigate([], {
      queryParams: { order: this._orderService.positionInCart },
      queryParamsHandling: 'merge'
    });

    this._authService.login();
  }
}
