import { Component, Input, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Subject } from 'rxjs';
import { AuthService } from '#shared/modules/common-services/auth.service';
import { ExternalProvidersService } from '#shared/modules/common-services/external-providers.service';
import { MetrikaEventTypeModel } from '#shared/modules/common-services/models/metrika-event-type.model';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-auth-decision-maker',
  templateUrl: './auth-decision-maker.component.html',
  styleUrls: ['./auth-decision-maker.component.scss'],
})
export class AuthDecisionMakerComponent {
  @Output() destroyModalChange: Subject<any> = new Subject();
  @Input() description: string;
  @Input() loginRedirectPath: string;

  constructor(private _authService: AuthService, private _externalProvidersService: ExternalProvidersService) {}

  login(): void {
    const tag = {
      event: 'login',
      ecommerce: {
        checkout_option: {
          actionField: { step: 2, option: 'login' },
        },
      },
    };
    this._externalProvidersService.fireGTMEvent(tag);
    this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.MODAL_AUTH_SIGN_IN).subscribe();
    this._destroy();
    this._authService.login(this.loginRedirectPath);
  }

  register(): void {
    const tag = {
      event: 'registration’',
      ecommerce: {
        checkout_option: {
          actionField: { step: 3, option: 'registration' },
        },
      },
    };
    this._externalProvidersService.fireGTMEvent(tag);
    this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.MODAL_AUTH_REGISTER).subscribe();
    this._destroy();
    this._authService.register('/my/organizations?tab=c;/cart');
  }

  private _destroy() {
    this.destroyModalChange.next(true);
  }
}
