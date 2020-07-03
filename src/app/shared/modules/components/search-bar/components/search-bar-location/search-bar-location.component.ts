import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { LocalStorageService, LocationService } from '../../../../common-services';
import { LocationModel, Megacity } from '../../../../common-services/models/location.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { filter, switchMap } from 'rxjs/operators';
import { combineLatest, of, Subject } from 'rxjs';

@Component({
  selector: 'my-search-bar-location',
  templateUrl: './search-bar-location.component.html',
  styleUrls: [
    './search-bar-location.component.scss',
  ],
})

export class SearchBarLocationComponent implements OnInit, OnDestroy {

  constructor(
    private _locationService: LocationService,
    private _localStorageService: LocalStorageService,
    private _fb: FormBuilder,
  ) {
  }

  private _unsubscriber$: Subject<any> = new Subject();

  @Output() stateLocationForm: EventEmitter<LocationModel> = new EventEmitter();

  locationForm: FormGroup;
  foundCities: LocationModel[] = [];
  megacities = Megacity.ALL;

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this._initForm();
    this._subscribeOnCityRequest();
  }

  @Input()
  set cleanLocationForm(visible: boolean) {
    if (!visible) {
      this.ngOnInit();
    }
  }

  private _initForm() {

    this.foundCities = this.megacities;

    if (this._localStorageService.hasUserLocation()) {
      const userLocation = this._localStorageService.getUserLocation();
      if (!this.foundCities.find(res => res.fias === userLocation.fias)) {
        this.foundCities.unshift(userLocation);
      }
    }

    this.locationForm = this._fb.group({
      city: ''
    });
  }

  private _subscribeOnCityRequest(): void {
    this.locationForm.controls.city.valueChanges
      .pipe(
        filter(cityName => cityName.length > 1),
        switchMap((cityName) => {
          return combineLatest([of(cityName), this._locationService.searchLocations(cityName)]);
        })
      )
      .subscribe(([city, cities]) => {
        // todo:  Избавиться от лага сдвойным кликом по выбранному городу
        this.foundCities = cities.filter(r => r.name.toLowerCase().includes(city));
      }, (err) => {
        console.error(err);
      });
  }

  chooseCity(location: LocationModel) {
    this._localStorageService.putUserLocation(location);
    this.stateLocationForm.emit(location);
  }
}


