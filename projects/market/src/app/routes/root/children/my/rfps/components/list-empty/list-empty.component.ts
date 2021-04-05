import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'market-list-empty',
  templateUrl: './list-empty.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListEmptyComponent {
  @Input() emptyText = 'Список пуст';
}
