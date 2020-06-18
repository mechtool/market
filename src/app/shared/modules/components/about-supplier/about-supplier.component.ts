import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SuppliersItemModel } from '#shared/modules';

@Component({
  selector: 'my-about-supplier',
  templateUrl: './about-supplier.component.html',
  styleUrls: [
    './about-supplier.component.scss',
    './about-supplier.component-576.scss',
    './about-supplier.component-400.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AboutSupplierComponent implements OnInit, OnDestroy {

  @Input() supplier: SuppliersItemModel;
  @Input() supplierLogo: string;
  @Input() showStoreButton: boolean;

  constructor() {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }
}
