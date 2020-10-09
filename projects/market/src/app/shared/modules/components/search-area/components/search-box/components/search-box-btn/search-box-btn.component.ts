import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'market-search-box-btn',
  templateUrl: './search-box-btn.component.html',
  styleUrls: ['./search-box-btn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxBtnComponent {
  @Input() isPressed = false;
  @Input() isDisabled = false;
  @Input() set iconPath(value: string) {
    this._iconPath = value;
  }
  @Input() dataCounter: number;
  @Output() btnClick: EventEmitter<boolean> = new EventEmitter();
  private _iconPath: string;

  get iconUrlString(): string {
    return this._sanitizer.sanitize(SecurityContext.STYLE, `url(./assets/${this._iconPath})`);
  }

  constructor(private _sanitizer: DomSanitizer) {}

  click() {
    this.btnClick.emit(true);
  }
}
