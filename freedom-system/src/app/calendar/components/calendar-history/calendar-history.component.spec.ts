import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarHistoryComponent } from './calendar-history.component';

describe('CalendarHistoryComponent', () => {
  let component: CalendarHistoryComponent;
  let fixture: ComponentFixture<CalendarHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
