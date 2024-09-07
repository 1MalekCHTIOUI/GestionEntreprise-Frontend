import { Produit } from './produit.model';
import { Client } from './client.model';
import { Tax } from './tax.model';
import { DevisItem } from './devis-item.model';

export interface Devis {
  id?: number;
  client_id: number;
  ref: string;
  date: Date;
  valid_until: Date;
  status: 'still' | 'done' | 'refused';
  totalHT: number;
  totalServices: number;
  totalRemises: number;
  totalFraisLivraison: number;
  totalTTC: number;
  produits?: Produit[];
  client?: Client;
  taxes?: Tax[];
  items?: DevisItem[];
}
