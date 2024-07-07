import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../product.service';
import { BASE_API_URL } from '../../configs/config';

@Component({
  selector: 'app-show-product',
  templateUrl: './show-product.component.html',
  styleUrls: ['./show-product.component.css'],
})
export class ShowProductComponent {
  produit: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    this.productService.getProduct(productId).subscribe((product) => {
      console.log(product[0]);

      this.produit = product[0];
    });
  }

  returnImg(img: string) {
    return BASE_API_URL + img;
  }
}
