import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowParameterComponent } from './show-parameter.component';

describe('ShowParameterComponent', () => {
  let component: ShowParameterComponent;
  let fixture: ComponentFixture<ShowParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowParameterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
