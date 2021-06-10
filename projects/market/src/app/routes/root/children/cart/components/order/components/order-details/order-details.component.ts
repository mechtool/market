import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { OrderService } from '../../order.service';
import { FormGroup } from '@angular/forms';
import { DeliveryMethodModel } from '../../models';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { Subscription } from 'rxjs';
import { unsubscribeList } from '#shared/utils';

@Component({
  selector: 'market-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: [
    './order-details.component.scss',
    './order-details.component-576.scss',
    './order-details.component-400.scss',
  ],
})
export class OrderDetailsComponent implements OnDestroy {
  minDate = new Date();
  currentDate = Date.now();

  @ViewChild('elementInputCity') elementInputCity: ElementRef;
  @ViewChild('elementInputStreet') elementInputStreet: ElementRef;
  @ViewChild('elementInputHouse') elementInputHouse: ElementRef;
  @ViewChild('elementInputContactName') elementInputContactName: ElementRef;
  @ViewChild('elementInputContactPhone') elementInputContactPhone: ElementRef;
  @ViewChild('elementInputContactEmail') elementInputContactEmail: ElementRef;

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < 1;
  };

  private readonly _focusSubscription: Subscription;

  get form(): FormGroup {
    return this._orderService.form;
  }

  get currentDateFormat(): string {
    const date = this.form?.controls.deliveryDesirableDate.value;

    if (date) {
      const pad = (n: number): string => (n < 10 ? `0${n}` : n.toString());
      return 'доставка dd.MM.yyyy в HH:mm'
        .replace('yyyy', date.getFullYear())
        .replace('MM', pad(date.getMonth() + 1))
        .replace('dd', pad(date.getDate()))
        .replace('HH', pad(date.getHours()))
        .replace('mm', pad(date.getMinutes()));
    }
  }

  get foundCities$() {
    return this._orderService.foundCities$;
  }

  get foundStreets$() {
    return this._orderService.foundStreets$;
  }

  get foundHouses$() {
    return this._orderService.foundHouses$;
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
    private _orderService: OrderService,
  ) {
    this._focusSubscription = this._orderService.focus$
      .subscribe((element) => {
        if (element === 'city') {
          this.elementInputStreet?.nativeElement.focus();
        }
        if (element === 'street') {
          this.elementInputHouse?.nativeElement.focus();
        }
        if (element === 'house') {
          this.elementInputHouse?.nativeElement.blur();
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
        if (element === 'cityError') {
          this.elementInputCity?.nativeElement.focus();
        }
      });
  }

  ngOnDestroy(): void {
    unsubscribeList([this._focusSubscription]);
  }
}
