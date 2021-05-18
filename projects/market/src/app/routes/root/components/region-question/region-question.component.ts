import { Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Level, LocalStorageService, LocationModel, LocationService } from '#shared/modules';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { validate as isUuid } from 'uuid';
import { Router } from '@angular/router';
import { unsubscribeList } from '#shared/utils';

declare const ymaps: {
  geolocation: {
    country: string;
    region: string;
    city: string;
  }
  ready(fnc: () => any);
};

const FEDERAL_CITIES: LocationModel[] = [
  {
    fias: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
    name: 'Москва',
    locality: 'Москва г',
    fullName: 'Москва г',
  },
  {
    fias: 'c2deb16a-0330-4f05-821f-1d09c93331e6',
    name: 'Санкт-Петербург',
    locality: 'Санкт-Петербург г',
    fullName: 'Санкт-Петербург г',
  },
  {
    fias: '6fdecb78-893a-4e3f-a5ba-aa062459463b',
    name: 'Севастополь',
    locality: 'Севастополь г',
    fullName: 'Севастополь г',
  }
];

@Component({
  selector: 'market-region-question',
  templateUrl: './region-question.component.html',
  styleUrls: ['./region-question.component.scss'],
})
export class RegionQuestionComponent implements OnDestroy {
  city: string;
  form: FormGroup;
  currentDate = Date.now();
  isApprovedRegion: boolean;
  foundCities: LocationModel[] = [];
  @ViewChild('regionQuestionTemplateRef') regionQuestionTemplateRef: TemplateRef<any>;

  private _modal: NzModalRef;
  private _currentLocation: LocationModel;
  private _cityFiasCodeSubscription: Subscription;
  private _geolocation: { country: string; region: string; city: string };

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _modalService: NzModalService,
    private _locationService: LocationService,
    private _notification: NzNotificationService,
    private _localStorageService: LocalStorageService
  ) {
    this.isApprovedRegion = this._localStorageService.isApproveRegion();

    if (!this.isApprovedRegion) {
      this.form = this._fb.group({
        cityFiasCode: this._fb.control(null),
      });

      this._handleCityValueChanges();

      try {
        ymaps.ready(() => {
          if (ymaps.geolocation && ymaps.geolocation.country === 'Россия') {
            this._geolocation = ymaps.geolocation;
          } else {
            this._geolocation = {
              country: 'Россия',
              region: 'Москва и Московская область',
              city: 'Москва'
            };
          }
        });
      } catch (err) {
        this._geolocation = {
          country: 'Россия',
          region: 'Москва и Московская область',
          city: 'Москва'
        };
      }

      /*
      todo Если пытаться выполнить этот метод в ymaps.ready, то логика открывшейся модалки по выбору региона начинает виснуть,
      todo Постараться избавиться от этого
       */
      setTimeout(() => {
        of(this._geolocation)
          .pipe(
            switchMap((region) => {
              if (FEDERAL_CITIES.some((loc) => loc.name === region.city)) {
                return of(FEDERAL_CITIES.filter((loc) => loc.name === region.city));
              }

              return this._locationService.searchAddresses({
                deliveryRegion: region.region,
                deliveryCity: region.city
              }, Level.CITY)
            }),
            catchError(() => {
              return of([]);
            })
          )
          .subscribe((locations) => {
            this._currentLocation = locations?.length ? locations[0] : FEDERAL_CITIES[0];
            this.regionQuestionNotification(this._currentLocation);
          }, (err) => {
            this._currentLocation = FEDERAL_CITIES[0];
            this.regionQuestionNotification(this._currentLocation);
          })
      }, 500);
    }
  }

  ngOnDestroy(): void {
    unsubscribeList([this._cityFiasCodeSubscription]);
  }

  approveRegion(notification: any) {
    this._localStorageService.putUserLocation(this._currentLocation);
    this._localStorageService.approveRegion();
    this.refreshPage();
    notification.close();
  }

  newRegion(template: TemplateRef<any>, notification: any) {
    notification.close();

    this._modal = this._modalService.create({
      nzTitle: 'Укажите Ваш населенный пункт',
      nzContent: template,
      nzFooter: null,
      nzWidth: 400,
      nzComponentParams: {}
    });
  }

  private _handleCityValueChanges() {
    this._cityFiasCodeSubscription = this.form.controls.cityFiasCode.valueChanges
      .pipe(
        tap((cityFiasCode) => {
          if (isUuid(cityFiasCode)) {
            const location = this.foundCities.find((res) => res.fias === cityFiasCode);
            this._localStorageService.putUserLocation(location);
            this._localStorageService.approveRegion();
            this._modal.close();
            this.refreshPage();
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

  private refreshPage() {
    const currentUrl = this._router.url;
    this._router.navigateByUrl('/blank', { skipLocationChange: true }).then(() => {
      this._router.navigate([currentUrl]);
    });
  }

  private regionQuestionNotification(location: LocationModel): void {
    if (location?.name) {
      this.city = location.name;
      this._notification.template(this.regionQuestionTemplateRef, {
        nzDuration: 0,
        nzPlacement: 'topLeft'
      });
    }
  }
}
