import { UntilDestroy } from '@ngneat/until-destroy';
import { Component } from '@angular/core';

@UntilDestroy({ checkProperties: true })
@Component({
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {

}
