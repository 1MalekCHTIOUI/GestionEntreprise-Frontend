import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { API } from '../configs/config';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-historiques',
  templateUrl: './historiques.component.html',
  styleUrls: ['./historiques.component.css'],
})
export class HistoriquesComponent {
  currentPage = 1;
  perPage = 10;
  totalItems = 0;

  selectedHs: any;
  historiques: any[] = [];
  searchString: string = '';
  sortOrder: string = 'desc';
  loaded = false;
  constructor(private http: HttpClient, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.fetchHistoriques();
  }

  fetchHistoriques(page: number = this.currentPage) {
    let params = new HttpParams().set('page', page.toString());
    this.http.get<any>(`${API}/historiques`, { params }).subscribe({
      next: (histo: any) => {
        console.log(histo);

        this.historiques = histo.data;
        this.currentPage = histo.current_page;
        this.totalItems = histo.total;
        this.loaded = true;
      },
      error: (response) => {
        this.loaded = true;
      },
    });
  }
  goToPage(pageNumber: number) {
    if (this.searchString) this.onSearch(pageNumber);
    else if (this.sortOrder) this.onSort(pageNumber);
    else this.fetchHistoriques(pageNumber);
  }

  onSearch(page: number = this.currentPage): void {
    let params = new HttpParams().set('page', page.toString());
    params = params.append('search_string', this.searchString);
    this.http
      .get(`${API}/historiques/search`, {
        params,
      })
      .subscribe((res: any) => {
        console.log(res);

        if (res.status === 404) {
          this.historiques = [];
        } else {
          this.historiques = res.data;

          this.currentPage = res.current_page;
          this.totalItems = res.total;
        }
      });
  }

  @ViewChild('detailsModal') detailsModal!: TemplateRef<any>;

  onSort(page: number = this.currentPage): void {
    let params = new HttpParams().set('page', page.toString());
    params = params.append('sort', this.sortOrder);
    this.http
      .get(`${API}/historiques/sort`, { params })
      .subscribe((res: any) => {
        if (res.status === 'nothing found') {
          this.historiques = [];
        } else {
          this.historiques = res.data;
          this.currentPage = res.current_page;
          this.totalItems = res.total;
        }
      });
  }
  openModal(hs: any) {
    this.selectedHs = hs;
    const modalRef = this.modalService.open(this.detailsModal, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      scrollable: true,
    });
  }

  returnClassAction(action: string) {
    let ac = action.toLowerCase();
    return {
      'text-success': ac === 'create',
      'text-danger': ac === 'delete',
      'text-primary': ac === 'update',
    };
  }
}
