import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargesFormComponent } from './charges-form.component';

describe('ChargesFormComponent', () => {
  let component: ChargesFormComponent;
  let fixture: ComponentFixture<ChargesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChargesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
