import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DocumentDto } from '#shared/modules/common-services/models';
import { resizeBusinessStructure, stringToRGB } from '#shared/utils';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'my-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: [
    './order-list.component.scss',
    './order-list.component-768.scss',
    './order-list.component-340.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent {

  @Input() documents: DocumentDto[];
  @Input() isLoading: boolean;
  @Input() page: number;
  @Output() loadDocuments: EventEmitter<number> = new EventEmitter();


  name(name: string) {
    return resizeBusinessStructure(name);
  }

  orgLogo(name: string) {
    return stringToRGB(name);
  }

  documentsLoading(nextPage: number) {
    this.loadDocuments.emit(nextPage);
  }
}
