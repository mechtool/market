import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-access-key-removal-verifier',
  templateUrl: './access-key-removal-verifier.component.html',
  styleUrls: ['./access-key-removal-verifier.component.scss'],
})
export class AccessKeyRemovalVerifierComponent {
  @Input() accessKeyId: string;
  @Output() accessKeyRemovalChange: EventEmitter<any> = new EventEmitter();
  @Output() destroyModalChange: EventEmitter<any> = new EventEmitter();

  constructor() {}

  remove() {
    this.accessKeyRemovalChange.emit(this.accessKeyId);
  }

  destroy() {
    this.destroyModalChange.emit(true);
  }

}

