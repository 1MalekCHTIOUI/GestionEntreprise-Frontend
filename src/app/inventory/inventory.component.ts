import { Component } from '@angular/core';
import { ProductService } from '../produits/product.service';
import { AccessoireService } from '../accessoires/accessoire.service';
import { Config } from '../configs/config';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory1.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent {
  active = 1;
  products: any[] = [];
  selectedProduct: any = null;
  accessories: any[] = [];
  selectedAccessory: any = null;
  qte: number = 0;

  prods: { id: any; quantity: any }[] = [];
  accs: { id: any; quantity: any }[] = [];

  accSuc = '';
  accFail = '';
  prodSuc = '';
  prodFail = '';
  searchQuery: string = '';
  currentPage = 1;
  perPage = 10;
  totalItems = 0;
  constructor(
    private prodService: ProductService,
    private accSerivce: AccessoireService,
    private config: Config
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(pageNumber: number = this.currentPage) {
    this.prodService.getProductsPaginate(pageNumber).subscribe({
      next: (products) => {
        console.log(products);

        this.products = products.data;
        this.currentPage = products.current_page;
        this.totalItems = products.total;
        this.perPage = products.per_page;
        this.prods = products.data.map((p: any) => {
          return { id: p.id, quantity: null };
        });
      },
      error: (err) => console.error(err),
    });
  }
  goToPageAcc(pageNumber: number) {
    this.fetchAccessories(pageNumber);
  }
  goToPageProd(pageNumber: number) {
    this.fetchProducts(pageNumber);
  }
  selectAccessoires() {
    this.fetchAccessories(1);
    this.qte = 0;
    this.selectedProduct = null;
    this.searchQuery = '';
  }

  selectProducts() {
    this.fetchProducts(1);
    this.qte = 0;
    this.selectedAccessory = null;
    this.searchQuery = '';
  }

  setProduct(product: any) {
    this.selectedProduct = product;
  }

  setAccessory(accessory: any) {
    this.selectedAccessory = accessory;
  }

  returnImg(image: string, folder: string) {
    console.log(image);

    if (image == null) return 'assets/images/default.png';
    else if (image.includes('https')) return image;
    else return this.config.getPhotoPath(folder) + image;
  }

  fetchAccessories(pageNumber: number = this.currentPage) {
    this.accSerivce.getAccessoiresPaginate(pageNumber).subscribe({
      next: (accessories) => {
        console.log(accessories);

        this.accessories = accessories.data;
        this.currentPage = accessories.current_page;
        this.totalItems = accessories.total;
        this.perPage = accessories.per_page;
        this.accs = accessories.data.map((p: any) => {
          return { id: p.id, quantity: null };
        });
      },
      error: (err) => console.error(err),
    });
  }

  onSubmitAcc(i: any) {
    const data = {
      accessory_id: this.accs[i].id,
      quantity: this.accs[i].quantity,
    };
    console.log(data);

    this.accSerivce.addQteAccessory(data).subscribe({
      next: (res) => {
        // this.fetchAccessories();
        // this.accs[i].quantity += this.qte;
        this.accessories[i].qte += data.quantity;

        this.qte = 0;
        this.accSuc = 'Accessory quantity modified successfully';
        setTimeout(() => {
          this.accSuc = '';
        }, 3000);
      },
      error: (err) => {
        console.error(err);
        this.accFail =
          err.error.message || 'Failed to modify accessory quantity';
      },
    });
  }

  onSubmitProd(i: any) {
    const data = {
      product_id: this.prods[i].id,
      quantity: this.prods[i].quantity,
    };
    console.log(data);

    this.prodService.addQteProduct(data).subscribe({
      next: (res) => {
        console.log(res);
        // this.fetchProducts();
        this.products[i].qte += data.quantity;
        this.qte = 0;
        this.prodSuc = 'Product quantity modified successfully';
        setTimeout(() => {
          this.prodSuc = '';
        }, 3000);
      },
      error: (err) => {
        console.error(err);
        this.prodFail =
          err.error.message || 'Failed to modify product quantity';
      },
    });
  }

  searchProduct() {
    if (this.searchQuery === '') return this.fetchProducts();
    this.prodService.getProductByTitle(this.searchQuery).subscribe({
      next: (products) => {
        this.products = products;
        this.prods = products.map((p: any) => {
          return { id: p.id, quantity: null };
        });
      },
      error: (err) => console.error(err),
    });
  }

  searchAccessory() {
    if (this.searchQuery === '') return this.fetchAccessories();

    this.accSerivce.getAccessoryByTitle(this.searchQuery).subscribe({
      next: (accessories) => {
        this.accessories = accessories;
        this.accs = accessories.map((p: any) => {
          return { id: p.id, quantity: null };
        });
      },
      error: (err) => console.error(err),
    });
  }
}
