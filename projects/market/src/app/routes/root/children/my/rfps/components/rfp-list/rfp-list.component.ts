import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RfpListItemModel } from '../../models';

@Component({
  selector: 'market-rfp-list',
  templateUrl: './rfp-list.component.html',
  styleUrls: [
    './rfp-list.component.scss',
    './rfp-list.component-768.scss',
  ]
})
export class RfpListComponent {
  @Input() rfps: RfpListItemModel[] = null;
  @Output() viewRfpChange: EventEmitter<string> = new EventEmitter();
  @Output() editRfpChange: EventEmitter<string> = new EventEmitter();
  @Output() cancelRfpChange: EventEmitter<string> = new EventEmitter();


  viewRfp(id: string): void {
    this.viewRfpChange.emit(id);
  }

  editRfp(id: string): void {
    this.editRfpChange.emit(id);
  }

  cancelRfp(id: string): void {
    this.cancelRfpChange.emit(id);
  }

}
