import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'market-spinner',
  templateUrl: './spinner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  constructor() {}
}
