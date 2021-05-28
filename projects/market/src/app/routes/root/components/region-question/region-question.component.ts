import { Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Level, LocationModel, Megacity } from '#shared/modules/common-services/models';
import { LocalStorageService, LocationService } from '#shared/modules/common-services';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { validate as isUuid } from 'uuid';
import { Router } from '@angular/router';
import { unsubscribeList } from '#shared/utils';

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

      setTimeout(() => {
        const geolocation = this._localStorageService.hasUserGeolocation()
          ? this._localStorageService.getUserGeolocation()
          : {
            country: 'Россия',
            region: 'Москва и Московская область',
            city: 'Москва'
          };

        of(geolocation)
          .pipe(
            switchMap((region) => {
              if (Megacity.FEDERAL_CITIES.some((loc) => loc.name === region.city)) {
                return of(Megacity.FEDERAL_CITIES.filter((loc) => loc.name === region.city));
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
            this._currentLocation = locations?.length ? locations[0] : Megacity.FEDERAL_CITIES[0];
            this.regionQuestionNotification(this._currentLocation);
          }, (err) => {
            this._currentLocation = Megacity.FEDERAL_CITIES[0];
            this.regionQuestionNotification(this._currentLocation);
          });
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
