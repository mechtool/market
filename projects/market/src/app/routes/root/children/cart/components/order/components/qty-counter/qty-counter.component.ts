import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-cart-order-qty-counter',
  templateUrl: './qty-counter.component.html',
  styleUrls: ['./qty-counter.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CartOrderQtyCounterComponent),
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartOrderQtyCounterComponent implements OnInit, ControlValueAccessor {
  form: FormGroup;

  @Input() min = 0;
  @Input() isDisabled = false;

  @Input()
  set value(val) {
    this.form.patchValue({ val });
  }

  get value(): number {
    return +this.form.get('val').value;
  }

  constructor(
    private _fb: FormBuilder,
  ) {
  }

  onlyNumberKey(event) {
    const charCode = (event.query) ? event.query : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  ngOnInit() {
    this._initForm();
    this.value = this.value || this.min;
    this.form.get('val').valueChanges.subscribe((_) => this.onChange(this.value));
  }

  private _initForm(): void {
    this.form = this._fb.group({
      val: new FormControl('', [Validators.required]),
    });
  }

  resetToZeroIfNull() {
    if (this.form.get('val').value === null) {
      this.value = 0;
    }
  }

  onChange(_: any) {
  }

  increment() {
    this.value++;
  }

  decrement() {
    if (this.value > this.min) {
      this.value--;
    }
  }

  writeValue(value: any) {
    this.value = value;
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched() {
  }

}

