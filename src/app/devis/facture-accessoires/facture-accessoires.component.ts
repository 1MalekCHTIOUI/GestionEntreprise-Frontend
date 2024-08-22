import { Component } from '@angular/core';
import { DevisService } from '../devis.service';

@Component({
  selector: 'app-facture-accessoires',
  templateUrl: './facture-accessoires.component.html',
  styleUrl: './facture-accessoires.component.css',
})
export class FactureAccessoiresComponent {
  devis: any[] = [];
  produits: any[] = [];
  accessoryStock: any[] = [];
  constructor(private devisService: DevisService) {}
  ngOnInit(): void {
    this.fetchDevis();
  }

  fetchDevis() {
    this.devisService.getAllDevis().subscribe({
      next: (data: any) => {
        this.devis = data;
        data.map((dev: any) => {
          this.produits = this.produits.concat(dev.produits);
        });
        // if (this.produits.length > 1) this.produits.shift();
        this.updateStockCounts();
      },
      error: (err) => console.log(err),
    });
  }

  updateStockCounts(): void {
    let accessories: any[] = [];

    this.produits.forEach((element: any) => {
      accessories = accessories.concat(element.accessoires);
    });

    let accessoryStock: { titre: number; qte: number; reqQte: number }[] = [];

    accessories.forEach((accessory: any) => {
      let oldAccessory = accessoryStock.find(
        (acc) => acc.titre === accessory.titre
      );
      if (oldAccessory) {
        let newQte = accessory.qte - oldAccessory.reqQte;
        accessoryStock.push({
          titre: accessory.titre,
          qte: newQte,
          reqQte: newQte,
        });
      } else {
        accessoryStock.push({
          titre: accessory.titre,
          qte: accessory.qte,
          reqQte: accessory.pivot.qte,
        });
      }
    });

    console.log(accessoryStock);
    this.accessoryStock = accessoryStock;
  }

  getRowNumber(outerIndex: number, innerIndex: number): number {
    let previousCounts = 0;
    for (let i = 0; i < outerIndex; i++) {
      previousCounts += this.produits[i].accessoires.length;
    }
    return previousCounts + innerIndex;
  }
}
