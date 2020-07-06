import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ProductDto, ProductFeatureModel, ValueTypeEnum } from '#shared/modules/common-services/models';

@Component({
  selector: 'my-product-description',
  templateUrl: './product-description.component.html',
  styleUrls: [
    './product-description.component.scss',
    './product-description.component-400.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDescriptionComponent implements OnInit, OnDestroy {

  @Input() product: ProductDto;

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  feature(item: ProductFeatureModel) {
    if (item.valueType === ValueTypeEnum.ENUMERATION) {
      return `${item.featureName}: ${item.valueName}`;
    }

    if (item.valueType === ValueTypeEnum.BOOLEAN) {
      return `${item.featureName}: ${item.value ? 'Да' : 'Нет'}`;
    }

    return `${item.featureName}: ${item.value}`;
  }
}
