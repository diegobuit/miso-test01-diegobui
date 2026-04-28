import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private _term = new BehaviorSubject<string>('');
  term$ = this._term.asObservable();

  setTerm(term: string): void {
    this._term.next(term);
  }
}
