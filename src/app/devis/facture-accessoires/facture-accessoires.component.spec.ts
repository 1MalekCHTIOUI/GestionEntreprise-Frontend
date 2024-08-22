import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureAccessoiresComponent } from './facture-accessoires.component';

describe('FactureAccessoiresComponent', () => {
  let component: FactureAccessoiresComponent;
  let fixture: ComponentFixture<FactureAccessoiresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FactureAccessoiresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactureAccessoiresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
