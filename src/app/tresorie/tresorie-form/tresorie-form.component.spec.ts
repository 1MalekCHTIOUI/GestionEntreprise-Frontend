import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TresorieFormComponent } from './tresorie-form.component';

describe('TresorieFormComponent', () => {
  let component: TresorieFormComponent;
  let fixture: ComponentFixture<TresorieFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TresorieFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TresorieFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
