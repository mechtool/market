import { Directive, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { fromEvent } from 'rxjs';
import { take } from 'rxjs/operators';

@Directive({
  selector: '[marketClickOutside]',
})
export class ClickOutsideDirective implements OnInit {
  @Output() marketClickOutside = new EventEmitter<void>();
  private _captured = false;

  constructor(private _el: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  private _onClick(target) {
    const clickedInside = this._el.nativeElement.contains(target);
    if (!this._captured) {
      return;
    }
    if (!clickedInside) {
      this.marketClickOutside.emit();
    }
  }

  ngOnInit() {
    fromEvent(document, 'click', { capture: true })
      .pipe(take(1))
      .subscribe(() => (this._captured = true));
  }
}
