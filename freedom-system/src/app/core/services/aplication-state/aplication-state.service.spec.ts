import { TestBed, inject } from '@angular/core/testing';

import { ApplicationStateService } from './aplication-state.service';

describe('AplicationStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApplicationStateService]
    });
  });

  it('should be created', inject([ApplicationStateService], (service: ApplicationStateService) => {
    expect(service).toBeTruthy();
  }));
});
