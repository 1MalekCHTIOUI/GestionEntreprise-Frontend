import { Devis } from './devis.model';

export interface DevisItem {
  id?: number;
  idDevis: number;
  description: string;
  qte: number;
  cost: number;
  devis?: Devis;
  totalPrice?: number;
}
