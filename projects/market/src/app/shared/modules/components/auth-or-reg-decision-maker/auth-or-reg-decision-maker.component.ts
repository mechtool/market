import { Component, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from '#shared/modules/common-services/auth.service';
import { ExternalProvidersService } from '#shared/modules/common-services/external-providers.service';
import { MetrikaEventTypeModel } from '#shared/modules/common-services/models/metrika-event-type.model';

@Component({
  selector: 'market-auth-decision-maker',
  templateUrl: './auth-or-reg-decision-maker.component.html',
  styleUrls: ['./auth-or-reg-decision-maker.component.scss', './auth-or-reg-decision-maker.component-400.scss'],
})
export class AuthOrRegDecisionMakerComponent {
  @Output() destroyModalChange: Subject<any> = new Subject();

  constructor(private _authService: AuthService, private _externalProvidersService: ExternalProvidersService) {
  }

  login(): void {
    const tag = {
      event: 'login',
    };
    this._externalProvidersService.fireGTMEvent(tag);
    this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.MODAL_AUTH_SIGN_IN);
    this._destroy();
    this._authService.login();
  }

  register(): void {
    const tag = {
      event: 'registration',
      ecommerce: {
        checkout_option: {
          actionField: { step: 3, option: 'registration' },
        },
      },
    };
    this._externalProvidersService.fireGTMEvent(tag);
    this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.MODAL_AUTH_REGISTER);
    this._destroy();
    this._authService.register();
  }

  private _destroy() {
    this.destroyModalChange.next(true);
  }
}
