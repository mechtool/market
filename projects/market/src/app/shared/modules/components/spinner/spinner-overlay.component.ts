import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'market-spinner-overlay',
  templateUrl: './spinner-overlay.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerOverlayComponent {
  constructor() {}
}
