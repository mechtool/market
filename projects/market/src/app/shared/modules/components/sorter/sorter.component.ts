import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SortModel } from '#shared/modules/common-services/models';
import { FormBuilder, FormControl } from '@angular/forms';


@Component({
  selector: 'market-results-sorter',
  templateUrl: './sorter.component.html',
  styleUrls: [
    './sorter.component.scss',
    './sorter.component-992.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SorterComponent implements OnInit {

  sortControl: FormControl;

  sortTypes = [
    { type: SortModel.ASC, label: 'По возрастанию цены' },
    { type: SortModel.DESC, label: 'По убыванию цены' }
  ];

  @Input() sort: SortModel;
  @Output() sortChange: EventEmitter<SortModel> = new EventEmitter();

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.sortControl = this._fb.control(this.sort ? this.sort : null);
    this._controlsSort();
  }

  private _controlsSort() {
    this.sortControl.valueChanges.subscribe((sort) => {
      this.sortChange.emit(sort);
    });
  }
}
