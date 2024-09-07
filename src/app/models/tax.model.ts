import { Devis } from './devis.model'; // Import if you have a separate Devis interface

export interface Tax {
  id?: number;
  name: string;
  rate: number;
  devis?: Devis[];
}
