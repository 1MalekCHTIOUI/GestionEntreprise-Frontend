import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDevisComponent } from './show-devis.component';

describe('ShowDevisComponent', () => {
  let component: ShowDevisComponent;
  let fixture: ComponentFixture<ShowDevisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowDevisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowDevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
