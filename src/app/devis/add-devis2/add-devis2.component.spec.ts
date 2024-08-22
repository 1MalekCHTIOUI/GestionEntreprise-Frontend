import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDevis2Component } from './add-devis2.component';

describe('AddDevis2Component', () => {
  let component: AddDevis2Component;
  let fixture: ComponentFixture<AddDevis2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddDevis2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDevis2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
