import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { absoluteImagePath, isAbsolutePathImg, isAssetsImg } from '#shared/utils/get-image';
import { Highlightable } from '@angular/cdk/a11y';
import { SearchAreaService } from '../../../../search-area.service';

@Component({
  selector: 'market-search-box-item',
  templateUrl: './search-box-item.component.html',
  styleUrls: ['./search-box-item.component.scss'],
})
export class SearchBoxItemComponent implements Highlightable, AfterViewInit {
  isActive = false;
  @Input() item: any;
  @Input() type: string;
  @Output() removeHistoricalSuggestionChanges: EventEmitter<string> = new EventEmitter();

  constructor(private _el: ElementRef, private _searchAreaService: SearchAreaService) {}

  ngAfterViewInit() {
    dispatchEvent(new CustomEvent('scroll'));
  }

  setActiveStyles() {
    const text = (this.item.searchText || this.item.highlight).replace(/<[^>]+>/g, '');
    const item = { text, type: this.type };
    this._searchAreaService.activeResultsItemChange$.next(item);
    this._el.nativeElement.scrollIntoView({ block: 'end', inline: 'nearest' });
    this.isActive = true;
  }

  setInactiveStyles() {
    this.isActive = false;
  }

  getLabel() {
    return this.item.searchText;
  }

  imageUrl(img): string {
    if (isAssetsImg(img) || isAbsolutePathImg(img)) {
      return img;
    }
    return img ? absoluteImagePath(img) : absoluteImagePath(null);
  }

  removeHistoricalSuggestion() {
    this.removeHistoricalSuggestionChanges.emit(this.item.id);
  }
}
