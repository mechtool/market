import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  templateUrl: './tech.component.html',
  styleUrls: ['./tech.component.scss'],
})
export class TechComponent {
  constructor() {}
}
