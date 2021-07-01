import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class SearchResultsService {
  scrollCommandChanges$: BehaviorSubject<'scroll' | 'stand'> = new BehaviorSubject(null);
  searchingResultsChanges$: BehaviorSubject<boolean> = new BehaviorSubject(null);
}
