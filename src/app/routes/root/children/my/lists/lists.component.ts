import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from '#shared/modules/common-services/auth.service';

@Component({
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
})
export class ListsComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();

  constructor(private _authService: AuthService) {}

  ngOnInit() {
      // console.log('logout');
      // this._authService.logout();
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

}
