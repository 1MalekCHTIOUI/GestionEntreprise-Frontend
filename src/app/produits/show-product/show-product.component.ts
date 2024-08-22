import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../product.service';
import { Config } from '../../configs/config';
import { CategoryService } from '../../categories/category.service';
import { map, Observable, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-show-product',
  templateUrl: './show-product.component.html',
  styleUrls: ['./show-product.component.css'],
})
export class ShowProductComponent {
  produit: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private config: Config
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    this.productService.getProduct(productId).subscribe((product) => {
      console.log(product[0]);

      this.produit = product[0];
      this.findCatParents(product[0].categories.id);
    });

    console.log(this.categories);
  }

  returnImg(img: string) {
    return this.config.getPhotoPath('produits') + img;
  }

  categories: any[] = [];

  findCatParents(id: number) {
    if (!id) {
      return;
    }
    this.categoryService.getCategory(id).subscribe({
      next: (category) => {
        console.log(category.titreCateg);

        if (category.idParentCateg) {
          this.findCatParents(category.idParentCateg);
        }
        this.categories.push(category.titreCateg);
      },
    });
  }
}
