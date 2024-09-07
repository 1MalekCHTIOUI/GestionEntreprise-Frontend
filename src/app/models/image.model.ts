import { Produit } from './produit.model';

export interface Image {
  id?: number;
  idProduit: number;
  titreImg: string;
  date: string;
  produit?: Produit;
}
