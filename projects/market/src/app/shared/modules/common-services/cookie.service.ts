import { Injectable } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { CookieService as NgxCookieService } from 'ngx-cookie-service';

@Injectable()
export class CookieService {
  private _routeDomain: string = null;

  constructor(private _location: PlatformLocation, private _ngxCookieService: NgxCookieService) {
    this._setRouteDomain();
  }

  getUserLastLoginTimestamp(uin: string): number {
    return +this._ngxCookieService.get(`last_login_timestamp_${uin}`);
  }

  setUserLastLoginTimestamp(uin: string, timestamp: number): void {
    if (this._routeDomain) {
      this._ngxCookieService.set(`last_login_timestamp_${uin}`, timestamp.toString(), null, '/', this._routeDomain, true);
    }
  }

  private _setRouteDomain(): void {
    const hostNameSplitted = this._location.hostname.split('.');
    const isDomainIPAddress = Number.isInteger(+hostNameSplitted[hostNameSplitted.length - 1]);
    if (isDomainIPAddress) {
      this._routeDomain = this._location.hostname;
    }
    if (!isDomainIPAddress) {
      this._routeDomain = `${hostNameSplitted[hostNameSplitted.length - 2]}.${hostNameSplitted[hostNameSplitted.length - 1]}`;
    }
  }
}
