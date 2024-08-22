import { Component, ViewChild } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  Observable,
  OperatorFunction,
  Subject,
} from 'rxjs';
import { TresorieService } from '../tresorie.service';
import { ActivatedRoute } from '@angular/router';
import { FactureService } from '../../factures/facture.service';
import { FormArray, FormGroup } from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tresorie-form',
  templateUrl: './tresorie-form.component.html',
  styleUrl: './tresorie-form.component.css',
})
export class TresorieFormComponent {
  tresorie: any = {};
  factures: any[] = [];
  successMessage = '';
  errorMessage = '';
  dateChequeDisabled: boolean = true;

  constructor(
    private tresorieService: TresorieService,
    private factureService: FactureService,
    private route: ActivatedRoute
  ) {}

  id = this.route.snapshot.paramMap.get('id');
  remainingBalance: any;
  ngOnInit(): void {
    this.loadFactures();
    this.tresorie.paye = false;
    this.loadTresorie();
    if (this.tresorie.numFacture) console.log('aa');

    // this.loadBalance(this.tresorie.numFacture?.ref);
  }

  loadTresorie() {
    if (this.id) {
      this.tresorieService.getTresorie(this.id).subscribe((tresorie) => {
        console.log(tresorie);

        this.tresorie = tresorie;
        this.tresorie.numFacture = tresorie.facture;
      });
    }
  }

  loadBalance(ref: any) {
    this.factureService.getRemainingBalance(ref).subscribe((balance) => {
      console.log(balance);
      return balance;
    });
  }

  typePaiement: any[] = [
    { id: 1, name: 'Virement' },
    { id: 2, name: 'Chèque' },
    { id: 3, name: 'Espèce' },
  ];

  onSubmit(): void {
    if (this.id) {
      const tres = {
        ...this.tresorie,
        numFacture: this.tresorie.numFacture?.ref,
      };
      console.log(tres);
      this.tresorieService.updateTresorie(this.id, tres).subscribe({
        next: (res) => {
          console.log(res);

          this.successMessage = res.message;
          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        },
        error: (err) => {
          console.log(err);
          this.errorMessage = 'Error adding tresorie: ' + err.error.message;
        },
      });
    } else {
      const tres = {
        ...this.tresorie,
        numFacture: this.tresorie.numFacture?.ref,
      };
      console.log(tres);

      if (tres.type_paiement === 'Chèque' && tres.date_cheque === undefined) {
        console.log('erro');

        this.errorMessage = 'Entrer la date de la cheque';
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
        return;
      }

      this.tresorieService.addTresorie(tres).subscribe({
        next: (res) => {
          console.log('Success', res);

          this.errorMessage = '';
          if (res === null) {
            this.successMessage = 'Tresorie added successfully';
          } else {
            this.successMessage =
              'Tresorie added successfully, remaining amount: ' +
              res.remaining_balance.toFixed(2);
          }

          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        },
        error: (err) => {
          console.log('error', err);

          this.errorMessage = 'Error adding tresorie: ' + err.error.message;
          this.successMessage = '';
        },
      });
    }
  }
  findFacture(num: any) {
    const est = this.factures.find((u) => u.ref == num);
    console.log(est);
    return est;
  }
  loadFactures() {
    this.factureService.getFactures().subscribe((factures) => {
      this.factures = factures;
      // this.factures = factures.map(async (f: any) => {
      //   return {
      //     ...f,
      //     remaining_balance: await this.loadBalance(f.ref),
      //   };
      // });
    });
  }

  tresForm!: FormGroup;

  @ViewChild('instance', { static: true }) instanceP!: NgbTypeahead;

  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  search: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const clicksWithClosedPopup$ = this.click$.pipe(
      filter(() => !this.instanceP.isPopupOpen())
    );
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) =>
        (term === ''
          ? this.factures
          : this.factures.filter(
              (v) => v.ref.toLowerCase().indexOf(term.toLowerCase()) > -1
            )
        ).slice(0, 10)
      )
    );
  };

  formatResult = (result: any) => result.ref;

  onPaymentTypeChange(selectedTypeId: string): void {
    this.dateChequeDisabled = selectedTypeId !== 'Chèque';
  }
}
