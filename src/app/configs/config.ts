export class Config {
  //   API: string = 'http://127.0.0.1:8000/api';
  BASE_API_URL: string = 'http://127.0.0.1:8000';
  AUTOCOMPLETE_INITIAL = 30;
  AUTOCOMPLETE_SEARCH_LIMIT = 2;
  constructor() {}

  public getStoragePath(): string {
    return this.BASE_API_URL + '/storage/';
  }

  getServerPath(): string {
    return this.BASE_API_URL;
  }

  getAPIPath(): string {
    return this.BASE_API_URL + '/api';
  }
  getPhotoPath(folder: string): string {
    let p = this.getStoragePath();

    switch (folder) {
      case 'accessoires': {
        console.log(p + 'assets/images/accessoires/');

        return p + 'assets/images/accessoires/';
      }
      case 'produits': {
        return p + 'assets/images/produits/';
      }
      case 'parameters': {
        return p + 'assets/images/parameters/';
      }
      case 'promotions': {
        return p + 'assets/images/promotions/';
      }
      case 'clients': {
        return p + 'assets/images/clients/';
      }
      default: {
        return p + 'assets/images/';
      }
    }
  }
}
