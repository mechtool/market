import { InjectionToken } from '@angular/core';
import { FilterFormConfigModel } from './filter-form.config.model';

export const FILTER_FORM_CONFIG = new InjectionToken<FilterFormConfigModel>('Filter Form Configuration');
