import { Facture } from './facture.model';

export interface Tresorie {
  id?: number;
  montant: number;
  type_paiement: string;
  date: string; // or Date if you use Date objects
  numFacture: string;
  date_cheque?: string; // or Date if you use Date objects
  paye: boolean;
  notes?: string;
  facture?: Facture;
}
