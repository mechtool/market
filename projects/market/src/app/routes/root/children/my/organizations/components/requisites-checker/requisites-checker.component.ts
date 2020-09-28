import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { innConditionValidator, innKppConditionValidator } from './requisites-condition.validator';


@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-requisites-checker',
  templateUrl: './requisites-checker.component.html',
  styleUrls: ['./requisites-checker.component.scss'],
})
export class RequisitesCheckerComponent implements OnInit {
  enterKpp = false;
  form: FormGroup;
  @Output() legalRequisitesChange: EventEmitter<any> = new EventEmitter();

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this._initForm();
  }

  private _initForm(): void {
    this.form = this._fb.group({
      inn: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), innConditionValidator]),
      kpp: new FormControl('', [Validators.pattern('^[0-9]*$'), Validators.min(100000000), Validators.max(999999999)]),
    }, { validator: innKppConditionValidator });
  }

  nexStep() {
    const inn = this.form.get('inn').value.toString();
    if (inn.length === 12) {
      this.send();
    }

    if (inn.length === 10 && !this.enterKpp) {
      this.form.controls.inn.disable();
      this.enterKpp = true;
    }
  }

  send() {
    const data = {
      inn: this.form.get('inn').value,
      ...(this.form.get('kpp').value) && { kpp: this.form.get('kpp').value },
    };
    this.legalRequisitesChange.emit(data);
  }
}


