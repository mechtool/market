import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  templateUrl: './single-organization.component.html',
  styleUrls: ['./single-organization.component.scss'],
})
export class SingleOrganizationComponent {

  constructor() {
  }

}
