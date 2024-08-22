import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPromotionsComponent } from './form-promotions.component';

describe('FormPromotionsComponent', () => {
  let component: FormPromotionsComponent;
  let fixture: ComponentFixture<FormPromotionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormPromotionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPromotionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
