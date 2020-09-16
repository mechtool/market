import { Injectable } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { CookieService as NgxCookieService } from 'ngx-cookie-service';
import { UserStatusEnumModel } from './models/user-status-enum.model';

const USER_STATUS = 'user_status';

@Injectable()
export class CookieService {
  private _routeDomain: string = null;

  get isUserStatusCookieAuthed(): boolean {
    return this._ngxCookieService.get(USER_STATUS) === UserStatusEnumModel.AUTHED;
  }

  constructor(private _location: PlatformLocation, private _ngxCookieService: NgxCookieService) {
    this._setRouteDomain();
  }

  setUserStatusCookie(statusName: string): void {
    if (this._routeDomain) {
      this._ngxCookieService.set(USER_STATUS, statusName, null, '/', this._routeDomain, true);
    }
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
