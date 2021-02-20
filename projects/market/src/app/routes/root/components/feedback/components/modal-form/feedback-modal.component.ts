import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { FeedbackService, NotificationsService } from '#shared/modules/common-services';
import { switchMap } from 'rxjs/operators';
import { unsubscribeList } from '#shared/utils';
import { Subscription } from 'rxjs';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-requisites-checker',
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.scss'],
})
export class FeedbackModalComponent implements OnInit, OnDestroy {
  form: FormGroup;
  @Output() feedbackEvent: EventEmitter<boolean> = new EventEmitter();
  private _recaptchaSubscription: Subscription;


  constructor(
    private _fb: FormBuilder,
    private _feedbackService: FeedbackService,
    private _notificationsService: NotificationsService,
    private _recaptchaV3Service: ReCaptchaV3Service,
  ) {
  }

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
