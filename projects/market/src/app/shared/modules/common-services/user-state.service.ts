import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthResponseModel } from './models';

@Injectable()
export class UserStateService {
  userData$: BehaviorSubject<AuthResponseModel> = new BehaviorSubject(null);

  constructor() {}
}
