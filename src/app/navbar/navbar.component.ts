import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isCollapsed = true;

  links: any = [
    {
      title: 'Home',
      path: '/',
    },
    {
      title: 'Produits',
      path: '/products',
    },
    {
      title: 'Accessoires',
      path: '/accessoires',
    },
    {
      title: 'Categories',
      path: '/categories',
    },
    {
      title: 'Inventaire',
      path: '/inventaire',
    },

    {
      title: 'Devis',
      path: '/devis',
    },
    {
      title: 'Factures',
      path: '/factures',
    },
    {
      title: 'Clients',
      path: '/clients',
    },
    {
      title: 'Promotions',
      path: '/promotions',
    },

    {
      title: 'Taxes',
      path: '/taxes',
    },

    {
      title: 'Tresories',
      path: '/tresorie',
    },
    {
      title: 'Credits',
      path: '/credits',
    },

    {
      title: 'Charges',
      path: '/charges',
    },
    {
      title: 'Statistiques',
      path: '/stats',
    },
    {
      title: 'Parametres',
      path: '/parameters',
    },
    {
      title: 'Historiques',
      path: '/historiques',
    },
    {
      title: 'Errors',
      path: '/errors',
    },
  ];
}
