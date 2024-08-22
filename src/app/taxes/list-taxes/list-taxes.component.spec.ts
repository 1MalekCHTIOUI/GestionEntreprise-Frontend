import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTaxesComponent } from './list-taxes.component';

describe('ListTaxesComponent', () => {
  let component: ListTaxesComponent;
  let fixture: ComponentFixture<ListTaxesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListTaxesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTaxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
