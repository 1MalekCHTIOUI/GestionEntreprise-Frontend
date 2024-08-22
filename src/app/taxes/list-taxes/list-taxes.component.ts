import { Component } from '@angular/core';
import { TaxesService } from '../taxes.service';

@Component({
  selector: 'app-list-taxes',
  templateUrl: './list-taxes.component.html',
  styleUrl: './list-taxes.component.css',
})
export class ListTaxesComponent {
  taxes: any[] = [];
  constructor(private taxService: TaxesService) {}

  ngOnInit(): void {
    this.fetchTaxes();
  }

  fetchTaxes() {
    this.taxService.getTaxes().subscribe({
      next: (data: any) => {
        console.log(data);
        this.taxes = data;
      },
      error: (err) => console.log(err),
    });
  }

  deleteTax(tax: any) {
    if (confirm(`Are you sure you want to delete ${tax.name}?`))
      this.taxService.deleteTaxe(tax.id).subscribe({
        next: (data: any) => {
          console.log(data);
          this.fetchTaxes();
        },
        error: (err) => console.log(err),
      });
  }
}
