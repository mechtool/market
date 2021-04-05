import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Level, LocationModel } from '#shared/modules/common-services/models';
import { switchMap, tap } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { LocationService } from '#shared/modules';
import { validate as isUuid } from 'uuid';
import { unsubscribeList } from '#shared/utils';

const FEDERAL_CITIES = ['Москва г', 'Санкт-Петербург г', 'Севастополь г']

@Component({
  templateUrl: './address-search-form.component.html',
  styleUrls: ['./address-search-form.component.scss'],
})
export class AddressSearchFormComponent implements OnInit, OnDestroy {
  currentDate = Date.now();
  form: FormGroup;
  foundRegions: LocationModel[] = [];
  foundCities: LocationModel[] = [];
  foundStreets: LocationModel[] = [];
  foundHouses: LocationModel[] = [];

  @Input() type: 'deliveryRegion' | 'pickupFrom'
  @Output() addressChange: EventEmitter<any> = new EventEmitter();

  @ViewChild('elementInputCity') elementInputCity: ElementRef;
  @ViewChild('elementInputStreet') elementInputStreet: ElementRef;
  @ViewChild('elementInputHouse') elementInputHouse: ElementRef;

  private regionFiasCodeSubscription: Subscription;
  private cityFiasCodeSubscription: Subscription;
  private streetFiasCodeSubscription: Subscription;
  private houseFiasCodeSubscription: Subscription;


  get isDeliveryRegionType(): boolean {
    return this.type === 'deliveryRegion';
  }

  get isPickupFromType(): boolean {
    return this.type === 'pickupFrom';
  }

  get isFederalCity(): boolean {
    return FEDERAL_CITIES.includes(this.form.controls.region.value);
  }

  constructor(
    private _fb: FormBuilder,
    private _locationService: LocationService,
  ) {
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      fiasCode: this._fb.control(null),
      fullName: this._fb.control(null),
      region: this._fb.control(null),
      regionFiasCode: this._fb.control(null),
      city: this._fb.control(null),
      cityFiasCode: this._fb.control({ value: null, disabled: this.isDeliveryRegionType }),
      street: this._fb.control({ value: null, disabled: true }),
      streetFiasCode: this._fb.control({ value: null, disabled: true }),
      house: this._fb.control(null),
      houseFiasCode: this._fb.control({ value: null, disabled: true }),
      allRussia: this._fb.control(false),
    });

    this._handleRegionValueChanges();
    this._handleCityValueChanges();
    this._handleStreetValueChanges();
    this._handleHouseValueChanges();
  }

  ngOnDestroy(): void {
    unsubscribeList([
      this.regionFiasCodeSubscription,
      this.cityFiasCodeSubscription,
      this.streetFiasCodeSubscription,
      this.houseFiasCodeSubscription
    ]);
  }

  save() {
    this.addressChange.emit({
      name: this.form.controls.allRussia.value ? 'По всей России' : this.form.controls.fullName.value,
      fiasCode: this.form.controls.allRussia.value ? null : this.form.controls.fiasCode.value,
    });
  }

  private _handleRegionValueChanges() {
    this.regionFiasCodeSubscription = this.form.controls.regionFiasCode.valueChanges
      .pipe(
        tap((regionFiasCode) => {
          if (isUuid(regionFiasCode)) {
            const location = this.foundRegions.find((res) => res.fias === regionFiasCode);
            this.form.controls.region.patchValue(location?.region, { onlySelf: true, emitEvent: false });
            this._fillControls(regionFiasCode, location?.fullName);
          }
        }),
        tap((regionFiasCode) => {
          if (isUuid(regionFiasCode)) {
            if (this.isFederalCity) {
              this.form.controls.streetFiasCode.enable({ onlySelf: true, emitEvent: false });
              setTimeout(() => {
                this.elementInputStreet?.nativeElement.focus();
              }, 100);
            } else {
              this.form.controls.cityFiasCode.enable({ onlySelf: true, emitEvent: false });
              setTimeout(() => {
                this.elementInputCity?.nativeElement.focus();
              }, 100);
            }
          }
        }),
        switchMap((regionFiasCode) => {
          if (!isUuid(regionFiasCode) && regionFiasCode?.length > 1) {
            this.form.controls.streetFiasCode.patchValue(null, { onlySelf: true, emitEvent: false });
            this.form.controls.streetFiasCode.disable({ onlySelf: true, emitEvent: false });
            this.form.controls.cityFiasCode.patchValue(null, { onlySelf: true, emitEvent: false });
            this.form.controls.cityFiasCode.disable({ onlySelf: true, emitEvent: false });
            this._clearControls('region');
            return this._locationService.searchAddresses({ deliveryRegion: regionFiasCode }, Level.REGION);
          }
          return of([]);
        }),
      ).subscribe((regions) => {
        this.foundRegions = regions
          .filter((value, index, self) => value.region && self.findIndex(f => f.region === value.region) === index);
      }
    );
  }

  private _handleCityValueChanges() {
    this.cityFiasCodeSubscription = this.form.controls.cityFiasCode.valueChanges
      .pipe(
        tap((cityFiasCode) => {
          if (isUuid(cityFiasCode)) {
            const location = this.foundCities.find((res) => res.fias === cityFiasCode);
            this.form.controls.city.patchValue(location?.locality, { onlySelf: true, emitEvent: false });
            this._fillControls(cityFiasCode, location?.fullName);
          }
        }),
        tap((cityFiasCode) => {
          if (isUuid(cityFiasCode)) {
            this.form.controls.streetFiasCode.enable({ onlySelf: true, emitEvent: false });
            setTimeout(() => {
              this.elementInputStreet?.nativeElement.focus();
            }, 100);
          }
        }),
        switchMap((cityFiasCode) => {
          if (!isUuid(cityFiasCode) && ((this.isDeliveryRegionType && cityFiasCode?.length > 0) || cityFiasCode?.length > 1)) {
            if (this.isPickupFromType) {
              this.form.controls.houseFiasCode.patchValue(null, { onlySelf: true, emitEvent: false });
              this.form.controls.houseFiasCode.disable({ onlySelf: true, emitEvent: false });
            }
            this.form.controls.streetFiasCode.patchValue(null, { onlySelf: true, emitEvent: false });
            this.form.controls.streetFiasCode.disable({ onlySelf: true, emitEvent: false });
            this._clearControls('city');

            const query = {
              deliveryRegion: this.form.controls.region.value,
              deliveryCity: cityFiasCode,
            };
            return this._locationService.searchAddresses(query, Level.CITY);
          }
          return of([]);
        }),
      ).subscribe((cities) => {
        this.foundCities = cities
          .filter((value, index, self) => value.locality && self.findIndex(f => f.locality === value.locality) === index);
      }
    );
  }

  private _handleStreetValueChanges() {
    this.streetFiasCodeSubscription = this.form.controls.streetFiasCode.valueChanges
      .pipe(
        tap((streetFiasCode) => {
          if (isUuid(streetFiasCode)) {
            const location = this.foundStreets.find((res) => res.fias === streetFiasCode);
            this.form.controls.street.patchValue(location?.street, { onlySelf: true, emitEvent: false });
            this._fillControls(streetFiasCode, location?.fullName);
          }
        }),
        tap((streetFiasCode) => {
          if (isUuid(streetFiasCode) && this.isPickupFromType) {
            this.form.controls.houseFiasCode.enable({ onlySelf: true, emitEvent: false });
            setTimeout(() => {
              this.elementInputHouse?.nativeElement.focus();
            }, 100);
          }
        }),
        switchMap((streetFiasCode) => {
          if (!isUuid(streetFiasCode) && streetFiasCode?.length > 0) {
            if (this.isPickupFromType) {
              this.form.controls.houseFiasCode.patchValue(null, { onlySelf: true, emitEvent: false });
              this.form.controls.houseFiasCode.disable({ onlySelf: true, emitEvent: false });
            }

            this._clearControls('street');
            const query = {
              deliveryRegion: this.form.controls.region.value,
              deliveryCity: this.form.controls.city.value,
              deliveryStreet: streetFiasCode,
            };
            return this._locationService.searchAddresses(query, Level.STREET);
          }
          return of([]);
        }),
      ).subscribe((streets) => {
        this.foundStreets = streets
          .filter((value, index, self) => value.street && self.findIndex(f => f.street === value.street) === index);
      }
    );
  }

  private _handleHouseValueChanges() {
    this.houseFiasCodeSubscription = this.form.controls.houseFiasCode.valueChanges
      .pipe(
        tap((houseFiasCode) => {
          if (isUuid(houseFiasCode)) {
            const location = this.foundHouses.find((res) => res.fias === houseFiasCode);
            this.form.controls.house.patchValue(location?.house, { onlySelf: true, emitEvent: false });
            this._fillControls(houseFiasCode, location?.fullName);
          }
        }),
        switchMap((houseFiasCode) => {
          if (!isUuid(houseFiasCode) && houseFiasCode?.length > 0) {
            if (houseFiasCode.includes('литер')) {
              /*
               * сервис https://api.orgaddress.1c.ru не может найти адрес если передать текст в формате 'text=Санкт-Петербург г, Ленина ул, 12/36, литер А'
               * при этом 'text=Санкт-Петербург г, Ленина ул, 12/36, литер' успешно находится, поэтому пришлось подоткнуть тут данный костыль
               */
              houseFiasCode = houseFiasCode.substr(0, houseFiasCode.indexOf('литер') + 5);
            }
            this._clearControls('house');

            const query = {
              deliveryCity: this.form.controls.city.value,
              deliveryStreet: this.form.controls.street.value,
              deliveryHouse: houseFiasCode,
            };
            return this._locationService.searchAddresses(query, Level.HOUSE);
          }
          return of([]);
        }),
      ).subscribe((houses) => {
        this.foundHouses = houses
          .filter((value, index, self) => value.house && self.findIndex(f => f.house === value.house) === index);
      }
    );
  }

  private _fillControls(fiasCode: string, fullName: string): void {
    this.form.controls.fiasCode.patchValue(fiasCode, { onlySelf: true, emitEvent: false });
    this.form.controls.fullName.patchValue(fullName, { onlySelf: true, emitEvent: false });
  }

  private _clearControls(controlName: string): void {
    this.form.get(controlName).patchValue(null, { onlySelf: true, emitEvent: false });
    this.form.controls.fiasCode.patchValue(null, { onlySelf: true, emitEvent: false });
    this.form.controls.fullName.patchValue(null, { onlySelf: true, emitEvent: false });
  }
}

