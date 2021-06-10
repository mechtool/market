import { AfterViewInit, ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from '@angular/core';
import { NotificationsService } from "#shared/modules";

@Component({
  selector: 'marker-error-template-injector',
  template: `
    <ng-template #errorTpl>
      <span class="error-message-title">Сервис временно недоступен. Попробуйте позднее.</span>
      <p>Для продолжения работы обратитесь за помощью к службе поддержки: <a class="error-message-link" href="mailto:bn@1c.ru" target="_blank" rel="noopener noreferrer">bn@1c.ru</a></p>
    </ng-template>
  `,
  styles: [`
    .error-message-title {
      color: #ff4d4f;
    }
    .error-message-link {
      border-bottom: 1px solid #fedc8b;
    }
    .error-message-link:hover {
      border: none;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorTemplateInjectorComponent implements AfterViewInit {
  constructor(private _notificationsService: NotificationsService) {}

  @ViewChild("errorTpl") errorTpl: TemplateRef<any>;

  ngAfterViewInit(): void {
    this._notificationsService.setErrorTemplate(this.errorTpl);
  }
}
