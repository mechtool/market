import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ProductFeatureModel, ProductModel, ValueType } from '#shared/modules/common-services/models';

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

  @Input() product: ProductModel;

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  feature(item: ProductFeatureModel) {
    if (item.valueType === ValueType.ENUMERATION) {
      return `${item.featureName}: ${item.valueName}`;
    }

    if (item.valueType === ValueType.BOOLEAN) {
      return `${item.featureName}: ${item.value ? 'Да' : 'Нет'}`;
    }

    return `${item.featureName}: ${item.value}`;
  }
}
