import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { ClientService } from '../services/client.service';
import { Client } from '../../models/interface/client.model';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Config } from '../../configs/config';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list2.component.html',
  styleUrls: ['./clients-list.component.scss'],
})
export class ClientsListComponent {
  dataSource: Client[] = [];
  displayedColumns: string[] = [
    'logo',
    'tel2',
    'nom_societe',
    'email',
    'adresse',
    'nom',
    'actions',
  ];

  // For pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  perPage = 10;
  constructor(private clientService: ClientService, private config: Config) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getClientsPagniate().subscribe(
      (data) => {
        console.log('API call successful, data:', data); // Log the data to verify structure
        if (Array.isArray(data.data)) {
          this.dataSource = data.data; // Directly assign the array of clients
          this.currentPage = data.current_page;
          this.totalItems = data.total;
          this.perPage = data.per_page;
        } else {
          console.error('Data format is not an array:', data);
        }
      },
      (error) => {
        console.error('API call failed:', error); // Log any errors
      }
    );
  }

  // Pagination logic
  get paginatedClients(): Client[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.dataSource.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  deleteClient(id: number) {
    if (confirm('Are you sure you want to delete this client?')) {
      this.clientService.deleteClient(id).subscribe(
        () => {
          // On success, remove the client from the dataSource
          this.dataSource = this.dataSource.filter(
            (client) => client.id !== id
          );
          this.totalItems = this.dataSource.length; // Update total items count after deletion
          console.log('Client deleted successfully');
        },
        (error) => {
          console.error('Failed to delete client:', error);
        }
      );
    }
  }

  returnImg(image: string) {
    console.log(image);

    if (image.includes('https')) return image;
    else if (!image.includes('https'))
      return this.config.getPhotoPath('clients') + image;
    else if (image == null) return '/public/assets/images/default.png';
    else return '/public/assets/images/default.png';
  }
}
