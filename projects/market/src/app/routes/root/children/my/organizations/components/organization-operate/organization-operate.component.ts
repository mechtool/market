import { Input, Output, Component, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { OrganizationResponseModel } from '#shared/modules/common-services/models/organization-response.model';

type OperationType = 'register'|'edit';

@UntilDestroy({ checkProperties: true })
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
  @Input() organizationData: OrganizationResponseModel;
  @Input() operationType: OperationType = 'register';
  @Input() legalRequisites: { inn: string; kpp?: string; };
  @Output() organizationDataChange: EventEmitter<any> = new EventEmitter();

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
      organizationName: new FormControl(this.organizationData?.name || '', [Validators.required]),
      organizationDescription: new FormControl(this.organizationData?.description || ''),
      organizationEmail: new FormControl(this.organizationData?.contacts?.email || '', [Validators.email]),
      organizationPhone: new FormControl(this.organizationData?.contacts?.phone || ''),
      organizationWebsite: new FormControl(this.organizationData?.contacts?.website || ''),
      organizationAddress: new FormControl(this.organizationData?.contacts?.address || ''),
      contactFio: new FormControl(this.organizationData?.contactPerson?.fullName || '', [Validators.required]),
      contactRole: new FormControl(this.organizationData?.contactPerson?.position || ''),
      contactEmail: new FormControl(this.organizationData?.contactPerson?.email || '', [Validators.required, Validators.email]),
      contactPhone: new FormControl(this.organizationData?.contactPerson?.phone || '', [Validators.required]),
      ...(this.operationType === 'register' && { agree: new FormControl(false, [Validators.requiredTrue]) }),
    });
  }

  send() {
    this.organizationDataChange.emit({
      ...this.form.value,
      ...{
        inn: this.form.get('inn').value,
        kpp: this.form.get('kpp').value
      }
    });
  }

}
