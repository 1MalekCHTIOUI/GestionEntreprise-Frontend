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
      title: 'Inventaire',
      path: '/inventaire',
    },
    {
      title: 'Categories',
      path: '/categories',
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
      title: 'Exceptions',
      path: '/exceptions',
    },

    {
      title: 'Historiques',
      path: '/historiques',
    },
  ];
}
