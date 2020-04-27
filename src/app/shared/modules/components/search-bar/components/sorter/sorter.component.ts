import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SortModel } from '../../../../common-services/models';


@Component({
  selector: 'my-results-sorter',
  templateUrl: './sorter.component.html',
  styleUrls: [
    './sorter.component.scss',
    './sorter.component-992.scss',
    './sorter.component-768.scss',
    './sorter.component-576.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SorterComponent implements OnInit, OnDestroy {

  sortTypes = [
    { type: SortModel.ASC, label: 'По возрастанию цены' },
    { type: SortModel.DESC, label: 'По убыванию цены' }
  ];

  @Input() sort: SortModel;
  @Output() sortChange: EventEmitter<SortModel> = new EventEmitter();

  constructor() {
  }

  get currentSortType(): any {
    if (this.sort) {
      return this.sortTypes.find(type => type.type === this.sort);
    }
    return this.sortTypes[0];
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  chooseSort(item: any) {
    this.sortChange.emit(item.type);
  }
}