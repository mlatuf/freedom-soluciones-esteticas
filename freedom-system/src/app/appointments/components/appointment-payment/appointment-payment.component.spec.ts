import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentPaymentComponent } from './appointment-payment.component';

describe('AppointmentPaymentComponent', () => {
  let component: AppointmentPaymentComponent;
  let fixture: ComponentFixture<AppointmentPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
