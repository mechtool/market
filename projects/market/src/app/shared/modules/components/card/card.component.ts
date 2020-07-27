import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'my-card',
  templateUrl: './card.component.html',
  styleUrls: [
    './card.component.scss',
    './card.component-576.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {

  constructor() {}

}
