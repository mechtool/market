import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { innConditionValidator } from '../../../organizations/components/requisites-checker/requisites-condition.validator';
import { notBlankValidator } from '#shared/utils/common-validators';
import { OrganizationsService } from '#shared/modules';

@Component({
  templateUrl: './white-list-form.component.html',
  styleUrls: ['./white-list-form.component.scss'],
})
export class WhiteListFormComponent {
  currentDate = Date.now();
  form: FormGroup;
  @Output() requisitesChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private _fb: FormBuilder,
    private _organizationsService: OrganizationsService,
  ) {
    this.form = this._fb.group({
      inn: this._fb.control(null, [notBlankValidator, Validators.pattern('^[0-9]*$'), innConditionValidator]),
    });
  }

  save() {
    this._organizationsService.findCounterpartyDataByInn(this.form.controls.inn.value)
      .subscribe((party) => {
        this.requisitesChange.emit({
          inn: party?.inn || this.form.controls.inn.value,
          kpp: party?.kpp || null,
          name: party?.name || null,
        });
      })
  }
}

