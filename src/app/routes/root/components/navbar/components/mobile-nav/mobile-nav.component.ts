import {
  Component,
  OnInit,
  OnDestroy,
  Input,
} from '@angular/core';
import { Subject } from 'rxjs';
import { NavigationService } from '#shared/modules';

@Component({
  selector: 'my-navbar-mobile-nav',
  templateUrl: './mobile-nav.component.html',
  styleUrls: [
    './mobile-nav.component.scss',
    './mobile-nav.component-768.scss',
  ],
})
export class NavbarMobileNavComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  @Input() isAuthed: boolean;

  constructor(
    private _navService: NavigationService,
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  toggleMenu() {
    // TODO: don't need to use JavaScript style
    document.getElementsByTagName('body')[0].classList.toggle('left-menu');
    this._navService.toggleMenu();
  }


}
