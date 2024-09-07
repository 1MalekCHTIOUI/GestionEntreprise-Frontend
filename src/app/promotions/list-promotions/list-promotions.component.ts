import { Component, ElementRef, ViewChild } from '@angular/core';
import { PromotionService } from '../promotion.service';
import { ClientService } from '../../clients/services/client.service';

@Component({
  selector: 'app-list-promotions',
  templateUrl: './list-promotions.component.html',
  styleUrl: './list-promotions.component.css',
})
export class ListPromotionsComponent {
  promotions: any[] = [];
  addedPromotions: any[] = [];
  addedClients: any[] = [];
  clients: any[] = [];
  constructor(
    private promotionService: PromotionService,
    private clientsService: ClientService
  ) {}

  ngOnInit(): void {
    this.getAllPromotions();
    this.fetchClients();
  }
  addPromotion(promotion: any): void {
    console.log(promotion);
    if (this.isSelectedPromotion(promotion)) {
      this.removePromotion(promotion);
      return;
    }
    this.addedPromotions.push(promotion);
  }

  addClient(client: any): void {
    console.log(client);
    if (this.isSelectedClient(client)) {
      // this.removeClient(client);
      return;
    }
    this.addedClients.push(client);
  }

  reset() {
    this.addedPromotions = [];
    this.addedClients = [];

    this.searchQuery = '';
    this.fetchClients();
  }
  searchQuery: string = '';

  searchClients() {
    if (!this.searchQuery) return this.fetchClients();
    this.promotionService.searchClientByName(this.searchQuery).subscribe({
      next: (clients: any) => {
        console.log(clients);

        this.clients = clients;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  fetchClients() {
    this.clientsService.getClients().subscribe({
      next: (clients: any) => {
        this.clients = clients.clients;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  removePromotion(promotion: any): void {
    this.addedPromotions = this.addedPromotions.filter(
      (p) => p.id !== promotion.id
    );
  }

  removeClient(client: any): void {
    this.addedClients = this.addedClients.filter((c) => c.id !== client.id);
  }

  isSelecting = false;
  setSelecting() {
    this.isSelecting = !this.isSelecting;
  }

  getAllPromotions() {
    this.promotionService.getPromotions().subscribe({
      next: (promotions: any) => {
        console.log(promotions);

        this.promotions = promotions;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }
  isSelectedPromotion(promotion: any): boolean {
    return this.addedPromotions.some((p) => p.id === promotion.id);
  }
  isSelectedClient(client: any): boolean {
    return this.addedClients.some((c) => c.id === client.id);
  }

  deletePromotion(id: number) {
    if (!confirm('Are you sure you want to delete this promotion?')) return;
    this.promotionService.deletePromotion(id).subscribe({
      next: (response) => {
        console.log(response);
        this.getAllPromotions();
      },
      error: (response) => {
        console.log(response);
      },
    });
  }
  @ViewChild('sendBtn') btn!: ElementRef;
  sending: boolean = false;
  async sendPromotion() {
    this.btn.nativeElement.disabled = true;
    this.sending = true;
    const status = await this.promotionService.sendPromotion(
      this.addedPromotions,
      this.addedClients
    );
    if (status) {
      // this.reset();
      console.log('All promotions sent successfully');
      this.sending = false;

      this.btn.nativeElement.disabled = false;
    } else {
      console.log('promotions failed');
      this.btn.nativeElement.disabled = false;
      this.sending = false;
    }
  }
}
