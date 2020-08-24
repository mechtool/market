import { Component, Input, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Subject } from 'rxjs';
import { AuthService } from '#shared/modules/common-services/auth.service';
import { Router } from '@angular/router';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-empty-organizations-info',
  templateUrl: './empty-organizations-info.component.html',
  styleUrls: ['./empty-organizations-info.component.scss'],
})
export class EmptyOrganizationsInfoComponent {
  @Output() destroyModalChange: Subject<any> = new Subject();

  constructor(private _router: Router) {}

  goToMyOrganizations(): void {
    this._destroy();
    this._router.navigateByUrl('/my/organizations?tab=c');
  }

  private _destroy() {
    this.destroyModalChange.next(true);
  }

}

