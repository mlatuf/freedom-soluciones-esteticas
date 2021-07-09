import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayMovementsComponent } from './day-movements.component';

describe('DayMovementsComponent', () => {
  let component: DayMovementsComponent;
  let fixture: ComponentFixture<DayMovementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayMovementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayMovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
