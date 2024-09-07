export interface Historique {
  id?: number;
  table: string;
  id_record: number;
  action: string;
  data_before?: Record<string, any>;
  data_after?: Record<string, any>;
  changed_at: string; // ISO date string
  changed_by: string;
}
