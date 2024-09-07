import { Produit } from './produit.model';

export interface Promotion {
  id?: number;
  description: string;
  image_footer?: string;
  promo: string;
  produits?: Produit[];
}
