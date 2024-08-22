import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTresorieComponent } from './list-tresorie.component';

describe('ListTresorieComponent', () => {
  let component: ListTresorieComponent;
  let fixture: ComponentFixture<ListTresorieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListTresorieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTresorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
