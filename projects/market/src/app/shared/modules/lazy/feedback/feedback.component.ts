import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  NgModule,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Subscription } from 'rxjs';
import { FeedbackService } from '#shared/modules/common-services/feedback.service';
import { NotificationsService } from '#shared/modules/common-services/notifications.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { unsubscribeList } from '#shared/utils';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'market-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackComponent implements OnInit, OnDestroy {
  form: FormGroup;
  @Output() feedbackEvent: EventEmitter<boolean> = new EventEmitter();
  private _recaptchaSubscription: Subscription;

  constructor(
    private _fb: FormBuilder,
    private _feedbackService: FeedbackService,
    private _notificationsService: NotificationsService,
    private _recaptchaV3Service: ReCaptchaV3Service,
  ) {}

  ngOnInit() {
    this._initForm();
  }

  ngOnDestroy(): void {
    unsubscribeList([this._recaptchaSubscription]);
  }

  send() {
    this._recaptchaSubscription = this._recaptchaV3Service
      .execute('action')
      .pipe(
        switchMap((token) => {
          return this._feedbackService.sendFeedback(
            {
              userName: this.form.controls.userName.value,
              emailOrPhone: this.form.controls.emailOrPhone.value,
              message: this.form.controls.message.value,
              pageUrl: location.href,
            },
            token,
          );
        }),
      ).subscribe((res) => {
          this.feedbackEvent.emit(true);
        },
        (error) => {
          this.feedbackEvent.emit(true);
          this._notificationsService.error('Произошла ошибка при отправке сообщения');
        },
      );
  }

  private _initForm(): void {
    this.form = this._fb.group({
      userName: new FormControl(''),
      emailOrPhone: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required]),
    });
  }

}

@NgModule({
  imports: [CommonModule, RouterModule, NzModalModule, FormsModule, ReactiveFormsModule, NzButtonModule],
  exports: [FeedbackComponent],
  declarations: [FeedbackComponent],
})
export class FeedbackModule {}
