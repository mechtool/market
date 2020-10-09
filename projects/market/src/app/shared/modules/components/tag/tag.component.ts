import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'market-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {}
