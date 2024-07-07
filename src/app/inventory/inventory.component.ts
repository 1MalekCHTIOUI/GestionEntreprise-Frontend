import { Component } from '@angular/core';
import { ProductService } from '../produits/product.service';
import { AccessoireService } from '../accessoires/accessoire.service';
import { BASE_API_URL } from '../configs/config';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent {
  active = 1;
  products: any[] = [];
  selectedProduct: any = null;
  accessories: any[] = [];
  selectedAccessory: any = null;
  qte: number = 0;

  accSuc = '';
  accFail = '';
  prodSuc = '';
  prodFail = '';

  constructor(
    private prodService: ProductService,
    private accSerivce: AccessoireService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchAccessories();
  }

  fetchProducts() {
    this.prodService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (err) => console.error(err),
    });
  }
  selectAccessoires() {
    this.qte = 0;
    this.selectedProduct = null;
  }

  selectProducts() {
    this.qte = 0;
    this.selectedAccessory = null;
  }

  returnImg(image: string) {
    return BASE_API_URL + image;
  }

  fetchAccessories() {
    this.accSerivce.getAccessoires().subscribe({
      next: (accessories) => {
        this.accessories = accessories;
      },
      error: (err) => console.error(err),
    });
  }

  onSubmitAcc() {
    const data = {
      accessory_id: this.selectedAccessory.id,
      quantity: this.qte,
    };
    console.log(data);

    this.accSerivce.addQteAccessory(data).subscribe({
      next: (res) => {
        // this.fetchAccessories();
        this.selectedAccessory.qte += this.qte;
        this.qte = 0;
        this.accSuc = 'Accessory added successfully';
        setTimeout(() => {
          this.accSuc = '';
        }, 3000);
      },
      error: (err) => {
        console.error(err);
        this.accFail = 'Failed to add accessory';
      },
    });
  }

  onSubmitProd() {
    const data = {
      product_id: this.selectedProduct.id,
      quantity: this.qte,
    };
    console.log(data);

    this.prodService.addQteProduct(data).subscribe({
      next: (res) => {
        console.log(res);
        // this.fetchProducts();
        this.selectedProduct.qte += this.qte;
        this.qte = 0;
        this.prodSuc = 'Product added successfully';
        setTimeout(() => {
          this.prodSuc = '';
        }, 3000);
      },
      error: (err) => {
        console.error(err);
        this.prodFail = 'Failed to add product';
      },
    });
  }
}
