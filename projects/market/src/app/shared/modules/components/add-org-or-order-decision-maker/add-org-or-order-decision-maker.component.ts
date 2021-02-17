import { Component, Input, OnInit, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MetrikaEventTypeModel } from '#shared/modules/common-services/models';
import { ExternalProvidersService } from '#shared/modules/common-services';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-empty-organizations-info',
  templateUrl: './add-org-or-order-decision-maker.component.html',
  styleUrls: [
    './add-org-or-order-decision-maker.component.scss',
    './add-org-or-order-decision-maker.component-400.scss',
  ],
})
export class AddOrgOrOrderDecisionMakerComponent implements OnInit {
  @Output() decisionMakerModalChange: Subject<any> = new Subject();
  @Input() isOrderType: boolean;
  description: string;

  constructor(private _router: Router, private _externalProvidersService: ExternalProvidersService) {
  }

  ngOnInit(): void {
    this.description = `Для оформления ${this.isOrderType ? 'заказа' : 'запроса цен'} необходимо зарегистрировать в сервисе "1С:Торговая площадка" вашу организацию.
    Также вы можете оформить ${this.isOrderType ? 'заказ' : 'запрос цен'} без регистрации и зарегистрировать организацию позднее.`;
  }

  registerAndMakeOrder() {
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

  goToMyOrganizations(): void {
    this.decisionMakerModalChange.next(false);
    this._router.navigateByUrl('/my/organizations?tab=c');
  }
}
