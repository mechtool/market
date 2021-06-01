import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { OrderV2Service } from '../../order-v2.service';
import { FormGroup } from '@angular/forms';
import { DeliveryMethodModel } from '../../../order/models';
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
    return this._orderV2Service.form;
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
    return this._orderV2Service.foundCities$;
  }

  get foundStreets$() {
    return this._orderV2Service.foundStreets$;
  }

  get foundHouses$() {
    return this._orderV2Service.foundHouses$;
  }

  get availableOrganizations() {
    return this._orderV2Service.availableOrganizations;
  }

  get pickupPoints(): any[] {
    return this._orderV2Service.pickupPoints;
  }

  get deliveryZones(): any[] {
    return this._orderV2Service.deliveryZones;
  }

  get deliveryMethods(): DeliveryMethodModel[] {
    return this._orderV2Service.deliveryMethods;
  }

  get selectedDelivery(): boolean {
    return this._orderV2Service.selectedDelivery;
  }

  constructor(
    private _orderV2Service: OrderV2Service,
  ) {
    this._focusSubscription = this._orderV2Service.focus$
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
