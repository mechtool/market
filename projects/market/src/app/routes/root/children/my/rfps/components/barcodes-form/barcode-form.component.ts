import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './barcode-form.component.html',
  styleUrls: ['./barcode-form.component.scss'],
})
export class BarcodeFormComponent implements OnInit {
  currentDate = Date.now();
  form: FormGroup;
  @Output() barCodeChange: EventEmitter<string> = new EventEmitter();

  constructor(
    private _fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.form = this._fb.group({
      barCode: this._fb.control(null, [Validators.required, Validators.maxLength(48)]),
    });
  }

  save() {
    this.barCodeChange.emit(this.form.get('barCode').value);
  }

}

