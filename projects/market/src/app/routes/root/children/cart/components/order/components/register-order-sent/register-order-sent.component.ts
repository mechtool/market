import { Component, Input, OnInit, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '#shared/modules/common-services/auth.service';
import { ExternalProvidersService, MetrikaEventTypeModel } from '#shared/modules';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-order-sent',
  templateUrl: './register-order-sent.component.html',
  styleUrls: ['./register-order-sent.component.scss'],
})
export class RegisterOrderSentComponent implements OnInit {
  @Input() isOrderType: boolean;
  @Input() isAnonymous: boolean;
  @Input() inn: string;
  @Input() kpp: string;
  @Output() destroyModalChange: Subject<any> = new Subject();
  title: string;
  description: string;

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _externalProvidersService: ExternalProvidersService) {
  }

  ngOnInit(): void {
    this.title = `${this.isOrderType ? 'Заказ' : 'Запрос цен'} отправлен поставщику`;
    this.description = `Отследить статус ${this.isOrderType ? 'заказа' : 'запроса цен'} и получить выставленный поставщиком счет
    вы можете в разделе «Мои заказы». Для этого зарегистрируйтесь.`;
  }

  goTo(): void {
    this.destroyModalChange.next(true);
    if (this.isAnonymous) {
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
      this._authService.register();
    } else {
      this._router.navigateByUrl(`/my/organizations?tab=c${this.inn ? `&inn=${this.inn}` : ''}${this.kpp ? `&kpp=${this.kpp}` : ''}`);
    }
  }
}
