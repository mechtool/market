import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { BreadcrumbsService } from '../../../../routes/root/components/breadcrumbs/breadcrumbs.service';

@Component({
  selector: 'my-error-code-alert',
  templateUrl: './error-code-alert.component.html',
  styleUrls: [
    './error-code-alert.component.scss',
    './error-code-alert.component-768.scss',
    './error-code-alert.component-576.scss',
    './error-code-alert.component-340.scss',
  ],
})
export class ErrorCodeAlertComponent implements OnInit, OnDestroy {
  codeArray: string[];
  @Input()
  set code(codeString: string) {
    this.codeArray = [...codeString];
  }
  @Input() title: string;
  @Input() descriptionBg: string;
  @Input() descriptionSm: string;
  private _unsubscriber$: Subject<any> = new Subject();

  constructor(private _breadcrumbsService: BreadcrumbsService) {
    this._breadcrumbsService.setVisible(false);
  }

  ngOnInit() {}

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }
}
