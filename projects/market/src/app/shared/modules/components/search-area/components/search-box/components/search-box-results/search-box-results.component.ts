import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SearchAreaService } from '../../../../search-area.service';
import { SearchResultsTitleEnumModel } from '../../../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'market-search-box-results',
  templateUrl: './search-box-results.component.html',
  styleUrls: ['./search-box-results.component.scss'],
})
export class SearchBoxResultsComponent implements OnInit {
  get resultsTitle(): SearchResultsTitleEnumModel {
    return this._searchAreaService.resultsTitle;
  }

  get suggestionsSpinnerShown(): Observable<boolean> {
    return this._searchAreaService.suggestionsSpinnerShown$;
  }

  get filterCollapsed(): boolean {
    return this._searchAreaService.filterCollapsed;
  }

  constructor(private _searchAreaService: SearchAreaService, private _cdr: ChangeDetectorRef) {}

  ngOnInit() {}
}
