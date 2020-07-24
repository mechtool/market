import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DocumentDto } from '#shared/modules/common-services/models';
import { resizeBusinessStructure, stringToRGB } from '#shared/utils';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'my-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: [
    './account-list.component.scss',
    './account-list.component-768.scss',
    './account-list.component-340.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountListComponent {

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
