import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowFactureComponent } from './show-facture.component';

describe('ShowFactureComponent', () => {
  let component: ShowFactureComponent;
  let fixture: ComponentFixture<ShowFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowFactureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
