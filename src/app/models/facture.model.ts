import { Devis } from './devis.model';
import { Tresorie } from './tresorie.model';

export interface Facture {
  id?: number;
  idDevis: number;
  ref: string;
  date: string; // or Date if you use Date objects
  status: string;
  totalHT: number;
  totalTTC: number;
  montant_restant: number;
  devis?: Devis;
  tresories?: Tresorie[];
}
