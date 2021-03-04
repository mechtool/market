import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AllGroupQueryFiltersModel, } from '#shared/modules/common-services/models';
import { UntilDestroy } from '@ngneat/until-destroy';

const MIN_LENGTH_QUERY = 3;
const MAX_LENGTH_QUERY = 100;

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-supplier-search-bar',
  templateUrl: './supplier-search-bar.component.html',
  styleUrls: ['./supplier-search-bar.component.scss', './supplier-search-bar.component-576.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierSearchBarComponent implements OnInit {
  form: FormGroup;
  isInputFocused = false;
  @Input() query: string;
  @Output() submitClick: EventEmitter<AllGroupQueryFiltersModel> = new EventEmitter();

  get validQuery(): boolean {
    return this.form.value.query?.trim().length === 0 || this.form.value.query?.trim().length >= MIN_LENGTH_QUERY
  }

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      query: [this.query, [Validators.required, Validators.minLength(MIN_LENGTH_QUERY), Validators.maxLength(MAX_LENGTH_QUERY)]],
    });
  }

  submit() {
    if (this.validQuery) {
      this.submitClick.emit({
        query: this.form.value.query,
      });
    }
  }

  cleanQuery() {
    this.form.controls.query.patchValue('');
    this.submitClick.emit({
      query: null,
    });
  }
}
