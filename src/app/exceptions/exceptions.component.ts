import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Config } from '../configs/config';

@Component({
  selector: 'app-exceptions',
  templateUrl: './exceptions.component.html',
  styleUrls: ['./exceptions.component.css'],
})
export class ExceptionsComponent {
  currentPage = 1;
  perPage = 10;
  totalItems = 0;

  selectedHs: any;
  exceptions: any[] = [];
  searchString: string = '';
  sortOrder: string = 'desc';
  loaded = false;
  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private config: Config
  ) {}
  API = this.config.getAPIPath() + '/exceptions';
  ngOnInit(): void {
    this.fetchExceptions();
  }

  fetchExceptions(page: number = this.currentPage) {
    let params = new HttpParams().set('page', page.toString());
    this.http.get<any>(`${this.API}`, { params }).subscribe({
      next: (histo: any) => {
        console.log(histo);

        this.exceptions = histo.data;
        this.currentPage = histo.current_page;
        this.totalItems = histo.total;
        this.perPage = histo.per_page;

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
    else this.fetchExceptions(pageNumber);
  }

  onSearch(page: number = this.currentPage): void {
    let params = new HttpParams().set('page', page.toString());
    params = params.append('search_string', this.searchString);
    this.http
      .get(`${this.API}/search`, {
        params,
      })
      .subscribe((res: any) => {
        console.log(res);

        if (res.status === 404) {
          this.exceptions = [];
        } else {
          this.exceptions = res.data;

          this.currentPage = res.current_page;
          this.totalItems = res.total;
          this.perPage = res.per_page;
        }
      });
  }

  @ViewChild('detailsModal') detailsModal!: TemplateRef<any>;

  onSort(page: number = this.currentPage): void {
    let params = new HttpParams().set('page', page.toString());
    params = params.append('sort', this.sortOrder);
    this.http.get(`${this.API}/sort`, { params }).subscribe((res: any) => {
      if (res.status === 'nothing found') {
        this.exceptions = [];
      } else {
        this.exceptions = res.data;
        this.currentPage = res.current_page;
        this.totalItems = res.total;
        this.perPage = res.per_page;
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
  parseContext(context: string): { key: string; value: string }[] {
    try {
      const parsed = JSON.parse(context);
      return Object.keys(parsed).map((key) => ({ key, value: parsed[key] }));
    } catch (error) {
      return [];
    }
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
