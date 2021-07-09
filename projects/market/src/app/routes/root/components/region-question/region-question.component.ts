import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Level, LocationModel, Megacity } from '#shared/modules/common-services/models';
import { LocalStorageService, LocationService } from '#shared/modules/common-services';
import { NzModalService } from 'ng-zorro-antd/modal';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AddressSearchFormComponent } from '#shared/modules';

@Component({
  selector: 'market-region-question',
  templateUrl: './region-question.component.html',
  styleUrls: ['./region-question.component.scss'],
})
export class RegionQuestionComponent {
  city: string;
  isApprovedRegion: boolean;
  foundCities: LocationModel[] = [];
  @ViewChild('regionQuestionTemplateRef') regionQuestionTemplateRef: TemplateRef<any>;

  private _currentLocation: LocationModel;

  constructor(
    private _router: Router,
    private _modalService: NzModalService,
    private _locationService: LocationService,
    private _notification: NzNotificationService,
    private _localStorageService: LocalStorageService
  ) {
    this.isApprovedRegion = this._localStorageService.isApproveRegion();

    if (!this.isApprovedRegion) {
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
            this._regionQuestionNotification(this._currentLocation);
          }, (err) => {
            this._currentLocation = Megacity.FEDERAL_CITIES[0];
            this._regionQuestionNotification(this._currentLocation);
          });
      }, 500);
    }
  }

  approveRegion(notification: any) {
    this._localStorageService.putUserLocation(this._currentLocation);
    this._localStorageService.approveRegion();
    this._refreshPage();
    notification.close();
  }

  newRegion(notification: any) {
    notification.close();

    const modal = this._modalService.create({
      nzTitle: 'Укажите Ваш населенный пункт',
      nzContent: AddressSearchFormComponent,
      nzFooter: null,
      nzWidth: 400,
      nzComponentParams: {}
    });

    modal.componentInstance.cityFiasCodeChange.subscribe(() => {
      modal.close();
      this._refreshPage();
    });
  }

  private _refreshPage() {
    const currentUrl = this._router.url;
    this._router.navigateByUrl('/blank', { skipLocationChange: true }).then(() => {
      this._router.navigateByUrl(currentUrl);
    });
  }

  private _regionQuestionNotification(location: LocationModel): void {
    if (location?.name) {
      this.city = location.name;
      this._notification.template(this.regionQuestionTemplateRef, {
        nzDuration: 0,
        nzPlacement: 'topLeft'
      });
    }
  }
}
