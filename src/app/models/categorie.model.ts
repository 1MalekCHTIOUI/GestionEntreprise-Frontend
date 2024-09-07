export interface Categorie {
  id?: number;
  titreCateg: string;
  descriptionCateg?: string;
  idParentCateg?: number;
  parent?: Categorie;
  sousCategories?: Categorie[];
}
