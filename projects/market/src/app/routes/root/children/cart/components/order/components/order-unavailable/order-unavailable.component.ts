import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-order-unavailable',
  templateUrl: './order-unavailable.component.html',
  styleUrls: ['./order-unavailable.component.scss'],
})
export class OrderUnavailableComponent {

  constructor() {}

}

