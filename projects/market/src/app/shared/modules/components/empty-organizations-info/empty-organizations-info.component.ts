import { Component, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-empty-organizations-info',
  templateUrl: './empty-organizations-info.component.html',
  styleUrls: [
    './empty-organizations-info.component.scss',
    './empty-organizations-info.component-400.scss',
  ],
})
export class EmptyOrganizationsInfoComponent {
  @Output() destroyModalChange: Subject<any> = new Subject();

  constructor(private _router: Router) {
  }

  goToMyOrganizations(): void {
    this.destroyModalChange.next(true);
    this._router.navigateByUrl('/my/organizations?tab=c');
  }
}
