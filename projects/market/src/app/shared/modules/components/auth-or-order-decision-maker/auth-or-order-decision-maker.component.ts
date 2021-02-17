import { Component, Input, OnInit, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Subject } from 'rxjs';
import { AuthService } from '#shared/modules/common-services/auth.service';
import { ExternalProvidersService } from '#shared/modules/common-services/external-providers.service';
import { MetrikaEventTypeModel } from '#shared/modules/common-services/models/metrika-event-type.model';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-auth-decision-maker',
  templateUrl: './auth-or-order-decision-maker.component.html',
  styleUrls: ['./auth-or-order-decision-maker.component.scss', './auth-or-order-decision-maker.component-400.scss'],
})
export class AuthOrOrderDecisionMakerComponent implements OnInit {
  @Output() decisionMakerModalChange: Subject<any> = new Subject();
  @Input() isOrderType: boolean;
  description: string;

  constructor(private _authService: AuthService, private _externalProvidersService: ExternalProvidersService) {
  }

  ngOnInit(): void {
    this.description = `Для оформления ${this.isOrderType ? 'заказа' : 'запроса цен'} необходимо войти на сайт под учетной записью "Интернет-поддержки пользователей (1С:ИТС)",
        указанной в вашем программном продукте "1С", или под вашей учетной записью облачного сервиса "1С:Предприятие через Интернет (1С:Фреш)".
        В случае их отсутствия можно оформить ${this.isOrderType ? 'заказ' : 'запрос цен'} без регистрации и зарегистрироваться позднее.`
  }

  login(): void {
    const tag = {
      event: 'login',
    };
    this._externalProvidersService.fireGTMEvent(tag);
    this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.MODAL_AUTH_SIGN_IN);
    this.decisionMakerModalChange.next(false);
    this._authService.login();
  }

  registerAndMakeOrder(): void {
    const tag = {
      event: 'orderWithoutRegistration',
      ecommerce: {
        checkout_option: {
          actionField: { step: 3, option: 'orderWithoutRegistration' },
        },
      },
    };
    this._externalProvidersService.fireGTMEvent(tag);
    this._externalProvidersService.fireYandexMetrikaEvent(MetrikaEventTypeModel.MODAL_ORDER_WITHOUT_REGISTRATION);
    this.decisionMakerModalChange.next(true);
  }
}
