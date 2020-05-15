import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { absoluteImagePath, isAssetsImg } from '#shared/utils/get-image';

@Component({
  selector: 'my-search-bar-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarItemComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  @Input() routerLink: string[];
  @Input() img: string;
  @Input() imgAlt: string;
  @Input() offersCount: string | number;
  @Input() type: string;
  @Input() typeOfSearch: string;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  imageUrl(img): string {
    if (isAssetsImg(img)) {
      return img;
    }
    return img ? absoluteImagePath(img) : absoluteImagePath(null);
  }

}
