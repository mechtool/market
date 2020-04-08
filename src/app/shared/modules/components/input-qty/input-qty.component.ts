import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'my-input-qty',
  templateUrl: './input-qty.component.html',
  styleUrls: ['./input-qty.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputQtyComponent implements OnInit {

  constructor() {}

  ngOnInit() {}

}
