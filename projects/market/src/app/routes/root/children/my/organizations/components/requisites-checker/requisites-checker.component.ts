import { Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-requisites-checker',
  templateUrl: './requisites-checker.component.html',
  styleUrls: ['./requisites-checker.component.scss'],
})
export class RequisitesCheckerComponent implements OnInit {
  form: FormGroup;

  constructor(
    private modal: NzModalRef,
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
    this.modal.destroy({ data });
  }

}


