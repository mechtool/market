import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FeedbackService, NotificationsService } from '#shared/modules/common-services';


@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-requisites-checker',
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.scss'],
})
export class FeedbackModalComponent implements OnInit {
  form: FormGroup;
  @Output() feedbackEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private _fb: FormBuilder,
    private _feedbackService: FeedbackService,
    private _notificationsService: NotificationsService,
  ) {
  }

  ngOnInit() {
    this._initForm();
  }

  send() {
    this._feedbackService.sendFeedback({
      userName: this.form.controls.userName.value,
      emailOrPhone: this.form.controls.emailOrPhone.value,
      message: this.form.controls.message.value,
      pageUrl: location.href,
    })
      .subscribe(() => {
        this.feedbackEvent.emit(true)
      }, (error) => {
        this.feedbackEvent.emit(true)
        this._notificationsService.error('Произошла ошибка при отправке сообщения');
      });
  }

  private _initForm(): void {
    this.form = this._fb.group({
      userName: new FormControl(''),
      emailOrPhone: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required]),
    });
  }
}


