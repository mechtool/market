import { Directive, HostListener } from '@angular/core';

const RE = /^[0-9]*$/;

@Directive({
  selector: '[marketOnlyNumber]'
})
export class OnlyNumberDirective {
  constructor() {}

  @HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent) {
    const keysToSkipValidation = [
      'Backspace',
      'Tab',
      'Enter',
      'Escape',
      'Delete',
      'Home',
      'End',
      'ArrowLeft',
      'ArrowRight'
    ];
    const keysWithMetaKeyToSkipValidation = ['a', 'c', 'v', 'x'];

    if ((keysWithMetaKeyToSkipValidation.includes(e.key) && (e.ctrlKey || e.metaKey)) ||
      keysToSkipValidation.includes(e.key) || RE.test(e.key)
    ) {
      return;
    }
    e.preventDefault();
  }

  @HostListener('paste', ['$event']) onPaste(e) {
    const pastedText = (e.originalEvent || e).clipboardData.getData(
      'text/plain'
    );

    if (pastedText) {
      if (!RE.test(pastedText)) {
        e.preventDefault();
      }
    }
  }
}
