import { InjectionToken } from '@angular/core';
import { AppConfigModel } from './app.config.model';

export const APP_CONFIG = new InjectionToken<AppConfigModel>('Application Configuration');
