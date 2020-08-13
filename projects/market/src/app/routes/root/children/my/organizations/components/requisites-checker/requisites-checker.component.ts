import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { innConditionValidator } from './inn-condition.validator';


@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-requisites-checker',
  templateUrl: './requisites-checker.component.html',
  styleUrls: ['./requisites-checker.component.scss'],
})
export class RequisitesCheckerComponent implements OnInit {
  form: FormGroup;
  @Output() legalRequisitesChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private _fb: FormBuilder,
  ) {}

  ngOnInit() {
    this._initForm();
  }

  private _initForm(): void {
    this.form = this._fb.group({
      inn: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      kpp: new FormControl('', [Validators.pattern("^[0-9]*$"), Validators.min(100000000), Validators.max(999999999)]),
    }, { validator: innConditionValidator });
  }


  send() {
    const data = {
      inn: this.form.get('inn').value,
      ...(this.form.get('kpp').value) && {kpp: this.form.get('kpp').value},
    };
    this.legalRequisitesChange.emit(data);
  }

}


