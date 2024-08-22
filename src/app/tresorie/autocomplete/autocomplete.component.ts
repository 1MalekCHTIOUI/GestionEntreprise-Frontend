import { Component, Input, ViewChild } from '@angular/core';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import {
  Observable,
  Subject,
  merge,
  filter,
  OperatorFunction,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  of,
} from 'rxjs';
import { TresorieService } from '../tresorie.service';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.css',
})
export class AutocompleteComponent {
  @ViewChild('instance', { static: true }) instance!: NgbTypeahead;
  model: any;
  factures: any[] = [];
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  constructor(private TresService: TresorieService) {}

  ngOnInit(): void {}

  search: OperatorFunction<string, readonly any[]> = (
    text$: Observable<string>
  ): Observable<readonly any[]> => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const clicksWithClosedPopup$ = this.click$.pipe(
      filter(() => !this.instance.isPopupOpen())
    );
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      switchMap((term) =>
        term === ''
          ? of([])
          : this.TresService.searchFactures(term).pipe(
              map((response) => response.map((item: any) => item.ref))
            )
      )
    );
  };

  formatResult = (result: any) => result;

  onInputBlur(): void {
    // Additional logic when input loses focus
  }
}
