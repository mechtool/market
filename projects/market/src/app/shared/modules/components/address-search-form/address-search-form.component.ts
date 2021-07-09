import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CartDataResponseModel, Level, LocalStorageService, LocationModel, LocationService } from '#shared/modules';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { validate as isUuid } from 'uuid';
import { of, Subscription } from 'rxjs';
import { unsubscribeList } from '#shared/utils';

@Component({
  templateUrl: './address-search-form.component.html',
  styleUrls: ['./address-search-form.component.scss'],
})
export class AddressSearchFormComponent implements OnDestroy {
  currentDate = Date.now();
  form: FormGroup;
  foundCities: LocationModel[] = [];

  @Output() cityFiasCodeChange: EventEmitter<boolean> = new EventEmitter();

  private _cityFiasCodeSubscription: Subscription;

  constructor(
    private _fb: FormBuilder,
    private _locationService: LocationService,
    private _localStorageService: LocalStorageService,
  ) {
    this.form = this._fb.group({
      cityFiasCode: this._fb.control(null),
    });
    this._handleCityValueChanges();
  }

  ngOnDestroy(): void {
    unsubscribeList([this._cityFiasCodeSubscription]);
  }


  private _handleCityValueChanges() {
    this._cityFiasCodeSubscription = this.form.controls.cityFiasCode.valueChanges
      .pipe(
        tap((cityFiasCode) => {
          if (isUuid(cityFiasCode)) {
            const location = this.foundCities.find((res) => res.fias === cityFiasCode);
            this._localStorageService.putUserLocation(location);
            this._localStorageService.approveRegion();
            this.cityFiasCodeChange.emit(true);
          }
        }),
        switchMap((city) => {
          if (!isUuid(city) && city?.length > 1) {
            return this._locationService.searchAddresses({ deliveryCity: city }, Level.CITY);
          }
          return of([]);
        }),
        catchError(() => {
          this._cityFiasCodeSubscription?.unsubscribe();
          this._handleCityValueChanges();
          return of(this.foundCities);
        }),
      ).subscribe((cities) => {
          this.foundCities = cities
            .filter((value, index, self) => value.locality && self.findIndex(f => f.locality === value.locality) === index);
        }
      );
  }



}
