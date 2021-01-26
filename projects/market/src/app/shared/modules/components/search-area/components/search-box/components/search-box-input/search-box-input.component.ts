import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { SearchAreaService } from '../../../../search-area.service';
import { unsubscribeList } from '#shared/utils';

@Component({
  selector: 'market-search-box-input',
  templateUrl: './search-box-input.component.html',
  styleUrls: ['./search-box-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchBoxInputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxInputComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  @ViewChild('queryInputEl') queryInputEl: ElementRef;
  @Input() placeholder = 'Поиск товаров';

  @Input()
  set queryText(val) {
    this._queryText = val;
    this.onChange(this._queryText);
  }

  private _queryText: string;

  private _elementQueryIsFocusedChangeSubscription: Subscription;
  private _elementQueryKeyUpChangeSubscription: Subscription;

  get queryText(): string {
    return this._queryText;
  }

  constructor(private _searchAreaService: SearchAreaService, private _cdr: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    this._elementQueryIsFocusedChangeSubscription = this._elementQueryIsFocused$().subscribe((isFocused) => {
      this._searchAreaService.focusChange$.next(isFocused);
    });
    this._elementQueryKeyUpChangeSubscription = this._elementQueryKeyUp$().subscribe((val) => {
      this._searchAreaService.keyUpChange$.next(val);
    });
  }

  ngOnDestroy() {
    unsubscribeList([this._elementQueryIsFocusedChangeSubscription, this._elementQueryKeyUpChangeSubscription]);
  }

  private _elementQueryIsFocused$(): Observable<boolean> {
    const elementQuery = this.queryInputEl.nativeElement;
    const elementQueryFocusChanges$ = fromEvent(elementQuery, 'focus');
    const elementQueryBlurChanges$ = fromEvent(elementQuery, 'blur');

    return merge(elementQueryFocusChanges$, elementQueryBlurChanges$).pipe(
      map((event: FocusEvent) => {
        return event.type === 'focus';
      }),
    );
  }

  private _elementQueryKeyUp$(): Observable<KeyboardEvent> {
    const elementQuery = this.queryInputEl.nativeElement;
    return fromEvent(elementQuery, 'keyup');
  }

  cleanQueryText(): void {
    this.queryText = '';
  }

  onChange(_: any) {
  }

  writeValue(val: string) {
    this._queryText = val;
    this._cdr.detectChanges();
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched() {
  }
}
