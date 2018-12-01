import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentEndDayComponent } from './appointment-end-day.component';

describe('AppointmentEndDayComponent', () => {
  let component: AppointmentEndDayComponent;
  let fixture: ComponentFixture<AppointmentEndDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentEndDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentEndDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
