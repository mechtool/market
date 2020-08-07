import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-user-removal-verifier',
  templateUrl: './user-removal-verifier.component.html',
  styleUrls: ['./user-removal-verifier.component.scss'],
})
export class UserRemovalVerifierComponent {
  @Input() userId: string;
  @Input() personName: string;
  @Output() userRemovalChange: EventEmitter<any> = new EventEmitter();
  @Output() destroyModalChange: EventEmitter<any> = new EventEmitter();

  constructor() {}

  remove(userId: string) {
    this.userRemovalChange.emit(userId);
  }

  destroy() {
    this.destroyModalChange.emit(true);
  }

}

