import { Component, Input, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Subject } from 'rxjs';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-access-key-removal-verifier',
  templateUrl: './access-key-removal-verifier.component.html',
  styleUrls: ['./access-key-removal-verifier.component.scss'],
})
export class AccessKeyRemovalVerifierComponent {
  @Input() accessKeyId: string;
  @Output() accessKeyRemovalChange: Subject<any> = new Subject();
  @Output() destroyModalChange: Subject<any> = new Subject();

  constructor() {}

  remove() {
    this.accessKeyRemovalChange.next(this.accessKeyId);
  }

  destroy() {
    this.destroyModalChange.next(true);
  }

}

