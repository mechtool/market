import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  innConditionValidator,
  innKppConditionValidator,
  kppConditionValidator
} from './search-counterparty.validator';
import { ExternalProvidersService, OrganizationsService } from '#shared/modules/common-services';
import { notBlankValidator } from '#shared/utils/common-validators';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-requisites-checker',
  templateUrl: './search-counterparty.component.html',
  styleUrls: ['./search-counterparty.component.scss'],
})
export class SearchCounterpartyComponent implements OnInit {
  enterKpp = false;
  form: FormGroup;
  @Output() counterpartyRequisitesChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private _fb: FormBuilder,
    private _organizationsService: OrganizationsService,
    private _externalProvidersService: ExternalProvidersService,
  ) {
  }

  ngOnInit() {
    this._initForm();
  }

  private _initForm(): void {
    this.form = this._fb.group(
      {
        inn: new FormControl('', [notBlankValidator, Validators.pattern('^[0-9]*$'), innConditionValidator]),
        kpp: new FormControl('', [Validators.pattern('^[0-9]*$'), notBlankValidator, kppConditionValidator]),
        name: new FormControl('', [Validators.required, notBlankValidator, Validators.minLength(3), Validators.maxLength(300)]),
      },
      { validator: innKppConditionValidator },
    );
  }

  onlyNumberKey(event) {
    const charCode = event.query ? event.query : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  nexStep() {
    const inn = this.form.value.inn;
    if ((inn.length === 10 || inn.length === 12) && !this.enterKpp) {

      this._organizationsService.findCounterpartyDataByInn(inn)
        .subscribe((res) => {
          if (res) {
            this.form.get('inn').setValue(res.inn, { onlySelf: true, emitEvent: true });
            this.form.get('kpp').setValue(res.kpp, { onlySelf: true, emitEvent: true });
            this.form.get('name').setValue(res.name, { onlySelf: true, emitEvent: true });
          }

          this.form.controls.inn.disable();
          this.enterKpp = true;
        });
    }
  }

  send() {
    const data = {
      inn: this.form.get('inn').value,
      name: this.form.get('name').value,
      ...(this.form.get('kpp').value && { kpp: this.form.get('kpp').value }),
    };

    this.counterpartyRequisitesChange.emit(data);

    const tag = {
      event: 'inn',
    };
    this._externalProvidersService.fireGTMEvent(tag);
  }
}
