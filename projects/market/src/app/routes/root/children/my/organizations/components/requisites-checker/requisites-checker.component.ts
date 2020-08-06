import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';

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
      inn: new FormControl('', [Validators.required]),
      kpp: new FormControl(''),
    });
  }


  send() {
    const data = {
      inn: this.form.get('inn').value,
      ...(this.form.get('kpp').value) && {kpp: this.form.get('kpp').value},
    };
    this.legalRequisitesChange.emit(data);
  }

}


