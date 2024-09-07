import { Produit } from './produit.model';

export interface Accessoire {
  id?: number;
  titre: string;
  description: string;
  prixAchat: number;
  prixVente: number;
  qte: number;
  image: string;
  active: boolean;
  produits?: Produit[]; // Assuming you have a Produit interface
  pivot: Pivot;
}

interface Pivot {
  idProduit: number;
  idAccessoire: number;
  qte: number;
  created_at: string;
  updated_at: string;
}
