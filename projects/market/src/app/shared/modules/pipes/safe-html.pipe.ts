import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import dompurify from 'dompurify';

@Pipe({
  name: 'marketSafeHtml',
  pure: true,
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(protected _sanitizer: DomSanitizer) {}

  public transform(value: string): any {
    const sanitizedContent = dompurify.sanitize(value);
    return this._sanitizer.bypassSecurityTrustHtml(sanitizedContent);
  }
}
