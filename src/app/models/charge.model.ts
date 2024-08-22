export interface Charge {
  id?: number;
  titre: string;
  type: 'static' | 'variable';
  description?: string;
  valeur: number;
  repetition: number;
  active: boolean;
}
