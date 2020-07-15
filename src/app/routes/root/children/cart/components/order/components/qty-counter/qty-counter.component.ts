import { Component, OnInit, Input, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'my-cart-order-qty-counter',
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
  @Input() max = 10000;
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
    this.form.get('val').valueChanges.subscribe(_ => this.onChange(this.value));
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

  onChange(_: any) {}

  increment() {
    if (this.value < this.max) {
      this.value++;
    }
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

  registerOnTouched() {}

}

