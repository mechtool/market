import { Input, Output, Component, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { OrganizationResponseModel } from '#shared/modules/common-services/models/organization-response.model';
import { notBlankValidator } from '#shared/utils/common-validators';

type OperationType = 'register'|'edit';

@Component({
  selector: 'market-organization-operate',
  templateUrl: './organization-operate.component.html',
  styleUrls: [
    './organization-operate.component.scss',
    './organization-operate.component-768.scss',
    './organization-operate.component-576.scss',
    './organization-operate.component-360.scss',
  ],
})
export class OrganizationOperateComponent implements OnChanges {
  form: FormGroup;
  currentDate = Date.now();
  @Input() organizationData: OrganizationResponseModel;
  @Input() operationType: OperationType = 'register';
  @Input() legalRequisites: { inn: string; kpp?: string; };
  @Output() organizationDataChange: EventEmitter<any> = new EventEmitter();

  get subject() {
    return this.form.controls.inn.value.toString().length === 10 ? 'юридического лица' : 'индивидуального предпринимателя';
  }

  get shortSubject() {
    return this.form.controls.inn.value.toString().length === 10 ? 'юр. лица' : 'ИП';
  }

  constructor(
    private _fb: FormBuilder) {
  }

  ngOnChanges(s: SimpleChanges) {
    this._initForm();
  }

  private _initForm(): void {
    this.form = this._fb.group({
      inn: new FormControl({ value: this.legalRequisites?.inn || '', disabled: true }, [Validators.required]),
      kpp: new FormControl({ value: this.legalRequisites?.kpp || '', disabled: true }),
      organizationName: new FormControl(this.organizationData?.name || '',
        [Validators.required, notBlankValidator, Validators.minLength(3), Validators.maxLength(150)]),
      organizationDescription: new FormControl(this.organizationData?.description || '',
        [notBlankValidator, Validators.maxLength(1000)]),
      organizationEmail: new FormControl(this.organizationData?.contacts?.email || '',
        [Validators.email, Validators.maxLength(100)]),
      organizationPhone: new FormControl(this.organizationData?.contacts?.phone || '',
        [Validators.maxLength(16)]),
      organizationWebsite: new FormControl(this.organizationData?.contacts?.website || '',
        [notBlankValidator, Validators.maxLength(100)]),
      organizationAddress: new FormControl(this.organizationData?.contacts?.address || '',
        [notBlankValidator, Validators.maxLength(500)]),
      contactFio: new FormControl(this.organizationData?.contactPerson?.fullName || '',
        [Validators.required, notBlankValidator, Validators.maxLength(100)]),
      contactEmail: new FormControl(this.organizationData?.contactPerson?.email || '',
        [Validators.required, Validators.email, Validators.maxLength(100)]),
      contactPhone: new FormControl(this.organizationData?.contactPerson?.phone || '',
        [Validators.required, Validators.maxLength(16)]),
      ...(this.operationType === 'register' && { agree: new FormControl(false, [Validators.requiredTrue]) }),
    });
  }

  send() {
    this.organizationDataChange.emit({
      ...this.form.value,
      ...(this.form.value.organizationPhone && { organizationPhone: `${this.form.value.organizationPhone}` }),
      ...{ contactPhone: `${this.form.value.contactPhone}` },
      ...{
        inn: this.form.get('inn').value,
        kpp: this.form.get('kpp').value
      }
    });
  }

}

