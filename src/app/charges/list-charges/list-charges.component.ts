import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Charge } from '../../models/charge.model';
import { ChargesService } from '../charges.service';

@Component({
  selector: 'app-list-charges',
  templateUrl: './list-charges.component.html',
  styleUrl: './list-charges.component.css',
})
export class ListChargesComponent {
  charges: Charge[] = [];

  constructor(private chargeService: ChargesService, private router: Router) {}

  ngOnInit(): void {
    this.loadCharges();
  }

  loadCharges(): void {
    this.chargeService.getCharges().subscribe((data: Charge[]) => {
      this.charges = data;
    });
  }

  editCharge(id: number): void {
    this.router.navigate(['/charges/edit', id]);
  }

  deleteCharge(id: number): void {
    if (confirm('Are you sure you want to delete this charge?')) {
      this.chargeService.deleteCharge(id).subscribe(() => {
        this.loadCharges();
      });
    }
  }
}
