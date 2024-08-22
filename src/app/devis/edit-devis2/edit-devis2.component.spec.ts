import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDevis2Component } from './edit-devis2.component';

describe('EditDevis2Component', () => {
  let component: EditDevis2Component;
  let fixture: ComponentFixture<EditDevis2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditDevis2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDevis2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
