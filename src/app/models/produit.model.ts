import { Accessoire } from './accessoire.model';
import { Categorie } from './categorie.model';
import { Cut } from './cut.model';
import { Devis } from './devis.model';
import { Image } from './image.model';
import { Promotion } from './promotion.model';

export interface Produit {
  id?: number;
  titre: string;
  ref: string;
  prixCharge: number;
  prixVente: number;
  qte: number;
  qteMinGros: number;
  prixGros: number;
  promo: boolean;
  longueur: number;
  largeur: number;
  hauteur: number;
  profondeur: number;
  couleur: string;
  tempsProduction: string;
  matiers: string;
  description: string;
  descriptionTechnique: string;
  ficheTechnique: string;
  publicationSocial: boolean;
  fraisTransport: number;
  idCategorie: number;
  imagePrincipale: string;
  active: boolean;
  accessoires?: Accessoire[];
  images?: Image[];
  categories?: Categorie;
  devis?: Devis[];
  promotions?: Promotion[];
  cuts?: Cut[];
  pivot: Pivot;
}
interface Pivot {
  idDevis: number;
  idProduit: number;
  qte: number;
  created_at: string;
  updated_at: string;
}
