import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentActionsComponent } from './appointment-actions.component';

describe('AppointmentActionsComponent', () => {
  let component: AppointmentActionsComponent;
  let fixture: ComponentFixture<AppointmentActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
