import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LocalStorageService } from '#shared/modules/common-services';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-cookie-agreement',
  templateUrl: './cookie-agreement.component.html',
  styleUrls: [
    './cookie-agreement.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookieAgreementComponent {

  get isAgreementNotAccepted() {
    return !this._localStorageService.getUserAndCookiesAgreement();
  }

  constructor(private _localStorageService: LocalStorageService) {
  }

  afterClose() {
    this._localStorageService.putUserAndCookiesAgreement();
  }
}
