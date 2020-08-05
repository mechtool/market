import { Component, Input } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-error-code-alert',
  templateUrl: './error-code-alert.component.html',
  styleUrls: [
    './error-code-alert.component.scss',
    './error-code-alert.component-768.scss',
    './error-code-alert.component-576.scss',
    './error-code-alert.component-340.scss',
  ],
})
export class ErrorCodeAlertComponent {
  codeArray: string[];
  @Input()
  set code(codeString: string) {
    this.codeArray = [...codeString];
  }
  @Input() title: string;
  @Input() descriptionBg: string;
  @Input() descriptionSm: string;

  constructor() {}

}
