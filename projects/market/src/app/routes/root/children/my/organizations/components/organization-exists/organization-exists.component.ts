import { Input, Output, Component, OnInit, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { OrganizationResponseModel } from '#shared/modules/common-services/models/organization-response.model';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-organization-exists',
  templateUrl: './organization-exists.component.html',
  styleUrls: [
    './organization-exists.component.scss',
    './organization-exists.component-768.scss',
  ],
})
export class OrganizationExistsComponent implements OnInit {
  form: FormGroup;
  @Input() organization: OrganizationResponseModel;
  @Output() requestDataChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private _fb: FormBuilder) {
  }

  ngOnInit() {
    this._initForm();
  }

  private _initForm(): void {
    this.form = this._fb.group({
      fio: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required]),
    });
  }

  send() {
    this.requestDataChange.emit(this.form.value);
  }

}

