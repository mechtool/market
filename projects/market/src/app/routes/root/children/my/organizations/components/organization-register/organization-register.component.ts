import { Input, Output, Component, EventEmitter, OnChanges } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'my-organization-register',
  templateUrl: './organization-register.component.html',
  styleUrls: [
    './organization-register.component.scss',
    './organization-register.component-768.scss',
    './organization-register.component-576.scss',
    './organization-register.component-360.scss',
  ],
})
export class OrganizationRegisterComponent implements OnChanges {
  form: FormGroup;
  @Input() legalRequisites: any;
  @Output() registerOrganizationDataChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private _fb: FormBuilder) {
  }

  ngOnChanges() {
    this._initForm();
  }

  private _initForm(): void {
    this.form = this._fb.group({
      inn: new FormControl({ value: this.legalRequisites?.inn || '', disabled: true }, [Validators.required]),
      kpp: new FormControl({ value: this.legalRequisites?.kpp || '', disabled: true }),
      organizationName: new FormControl('', [Validators.required]),
      organizationDescription: new FormControl(''),
      organizationEmail: new FormControl('', [Validators.email]),
      organizationPhone: new FormControl(''),
      organizationWebsite: new FormControl(''),
      organizationAddress: new FormControl(''),
      contactFio: new FormControl('', [Validators.required]),
      contactRole: new FormControl(''),
      contactEmail: new FormControl('', [Validators.required, Validators.email]),
      contactPhone: new FormControl('', [Validators.required]),
      agree: new FormControl(false, [Validators.requiredTrue]),
    });
  }

  send() {
    this.registerOrganizationDataChange.emit({
      ...this.form.value,
      ...{
        inn: this.form.get('inn').value,
        kpp: this.form.get('kpp').value
      }
    });
  }

}

