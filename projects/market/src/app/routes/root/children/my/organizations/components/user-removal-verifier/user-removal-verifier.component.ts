import { Component, Input, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Subject } from 'rxjs';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-user-removal-verifier',
  templateUrl: './user-removal-verifier.component.html',
  styleUrls: ['./user-removal-verifier.component.scss'],
})
export class UserRemovalVerifierComponent {
  @Input() userId: string;
  @Input() personName: string;
  @Output() userRemovalChange: Subject<any> = new Subject();
  @Output() destroyModalChange: Subject<any> = new Subject();

  constructor() {}

  remove(userId: string) {
    this.userRemovalChange.next(userId);
  }

  destroy() {
    this.destroyModalChange.next(true);
  }

}

