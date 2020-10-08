import { Injectable } from '@angular/core';
import { FeedbackRequestModel } from './models';
import { BNetService } from './bnet.service';
import { Observable } from 'rxjs';

@Injectable()
export class FeedbackService {
  constructor(private _bnetService: BNetService) {}

  sendFeedback(feedback: FeedbackRequestModel, token: string): Observable<any> {
    return this._bnetService.sendFeedback(feedback, token);
  }
}
