import { Input, Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[marketLineClamp]',
})
export class LineClampDirective {
  replacerElement: any;
  @Input() rows = 1;
  elemWidth: number;
  elemLineHeight: number;

  get content(): string {
    return this._el.nativeElement.innerHTML;
  }

  get parent(): HTMLElement {
    return this._el.nativeElement.parentNode;
  }

  @HostListener('DOMCharacterDataModified', ['$event']) onHostTextChanges(event: MutationEvent) {
    setTimeout(() => {
      this.elemWidth = parseInt(window.getComputedStyle(this._el.nativeElement, undefined).getPropertyValue('width'), 10) || this.elemWidth;
      this.elemLineHeight = parseInt(window.getComputedStyle(this._el.nativeElement, undefined).getPropertyValue('line-height'), 10);
      if (this.elemWidth && this.elemLineHeight) {
        this._render();
      }
    }, 0);
  }

  constructor(private _el: ElementRef, private _renderer: Renderer2) {}

  private _render(): void {
    this._showReplacer();
    this._hideCurrentElement();
  }

  private _hideCurrentElement(): void {
    this._renderer.setStyle(this._el.nativeElement, 'display', 'none');
  }

  private _showReplacer() {
    if (!this.replacerElement) {
      this.replacerElement = this._createReplacer();
      this._paintReplacerElement();
    }
    if (this.replacerElement) {
      this._renderer.setProperty(this.replacerElement, 'innerHTML', this.content);
    }
    this._ellipsisText();
  }

  private _createReplacer(): HTMLElement {
    const replacer = this._el.nativeElement.cloneNode(true);
    const text = this._renderer.createText(this.content);
    this._renderer.addClass(replacer, 'replacer');
    this._renderer.appendChild(replacer, text);
    this._renderer.insertBefore(this.parent, replacer, this._el.nativeElement);
    return replacer;
  }

  private _paintReplacerElement(): void {
    this._renderer.setStyle(this.replacerElement, 'width', `${this.elemWidth}px`);
    this._renderer.setStyle(this.replacerElement, 'lineHeight', `${this.elemLineHeight}px`);
    this._renderer.setStyle(this.replacerElement, 'maxHeight', `${this.elemLineHeight * this.rows}px`);
  }

  private _ellipsisText(etc?: string) {
    const wordArray = this.replacerElement.innerHTML.split(' ');
    while (this.replacerElement.scrollHeight > this.replacerElement.offsetHeight) {
      wordArray.pop();
      const content = wordArray.join(' ') + (etc || '...');
      this._renderer.setProperty(this.replacerElement, 'innerHTML', content);
    }
  }
}
