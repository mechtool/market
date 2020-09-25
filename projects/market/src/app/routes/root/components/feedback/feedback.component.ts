import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component, ViewContainerRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { FeedbackModalComponent } from './components';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: [
    './feedback.component.scss',
    './feedback.component-577.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackComponent {

  constructor(
    private _modalService: NzModalService,
    private _viewContainerRef: ViewContainerRef,
  ) {
  }

  openFeedback() {
    const modal = this._modalService.create({
      nzContent: FeedbackModalComponent,
      nzViewContainerRef: this._viewContainerRef,
      nzGetContainer: () => document.body,
      nzFooter: null,
      nzWidth: 450,
    });

    const subscription = modal.componentInstance.feedbackEvent
      .subscribe((success) => {
        if (success) {
          modal.destroy(true);
          subscription.unsubscribe();
        }
      });
  }
}
