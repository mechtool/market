import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProductDto } from '#shared/modules/common-services/models';

@Component({
  selector: 'market-product-description',
  templateUrl: './product-description.component.html',
  styleUrls: [
    './product-description.component.scss',
    './product-description.component-400.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDescriptionComponent {

  @Input() product: ProductDto;

}
