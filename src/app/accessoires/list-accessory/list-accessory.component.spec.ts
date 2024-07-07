import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAccessoryComponent } from './list-accessory.component';

describe('ListAccessoryComponent', () => {
  let component: ListAccessoryComponent;
  let fixture: ComponentFixture<ListAccessoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAccessoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAccessoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
