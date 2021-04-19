import { Component, Input } from '@angular/core';
import { PriceListResponseModel } from '#shared/modules/common-services/models';

@Component({
  templateUrl: './price-list-view-form.component.html',
  styleUrls: ['./price-list-view-form.component.scss'],
})
export class PriceListViewFormComponent {
  @Input() priceList: PriceListResponseModel;
}

