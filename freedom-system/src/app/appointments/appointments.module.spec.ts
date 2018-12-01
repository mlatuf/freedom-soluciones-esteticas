import { AppointmentsModule } from './appointments.module';

describe('AppointmentsModule', () => {
  let appointmentsModule: AppointmentsModule;

  beforeEach(() => {
    appointmentsModule = new AppointmentsModule();
  });

  it('should create an instance', () => {
    expect(appointmentsModule).toBeTruthy();
  });
});
