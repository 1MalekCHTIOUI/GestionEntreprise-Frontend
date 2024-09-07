import { Facture } from './facture.model';
import { Client } from './client.model';

export interface Credit {
  id?: number;
  client_id: number;
  numFacture: string;
  montant: number;
  date: string; // or Date if you use Date objects
  status: string;
  client?: Client;
  facture?: Facture;
}
