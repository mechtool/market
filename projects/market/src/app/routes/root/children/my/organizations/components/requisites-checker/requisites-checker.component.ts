import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  innConditionValidator,
  innKppConditionValidator,
  kppConditionValidator
} from './requisites-condition.validator';
import { ExternalProvidersService } from '#shared/modules';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-requisites-checker',
  templateUrl: './requisites-checker.component.html',
  styleUrls: ['./requisites-checker.component.scss'],
})
export class RequisitesCheckerComponent implements OnInit {
  currentDate = Date.now();
  form: FormGroup;
  enterKpp = false;
  @Input() inn: string;
  @Input() kpp: string;
  @Output() legalRequisitesChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private _fb: FormBuilder,
    private _externalProvidersService: ExternalProvidersService) {
  }

  ngOnInit() {
    this._initForm();
  }

  private _initForm(): void {
    if (this.kpp) {
      this.enterKpp = true;
    }
    this.form = this._fb.group({
        inn: new FormControl(this.inn, [Validators.required, Validators.pattern('^[0-9]*$'), innConditionValidator]),
        kpp: new FormControl(this.kpp, [Validators.pattern('^[0-9]*$'), kppConditionValidator]),
      },
      { validator: innKppConditionValidator });

    this.form.controls.inn.valueChanges
      .subscribe((inn) => {
        if (inn.length === 12) {
          this.enterKpp = false;
          this.form.controls.kpp.patchValue('', { onlySelf: true, emitEvent: true })
        }
      })
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
      ...(this.form.get('kpp').value && { kpp: this.form.get('kpp').value }),
    };
    this.legalRequisitesChange.emit(data);

    const tag = {
      event: 'inn',
    };
    this._externalProvidersService.fireGTMEvent(tag);
  }
}
