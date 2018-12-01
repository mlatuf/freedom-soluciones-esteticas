import { TestBed, inject } from '@angular/core/testing';

import { AplicationStateService } from './aplication-state.service';

describe('AplicationStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AplicationStateService]
    });
  });

  it('should be created', inject([AplicationStateService], (service: AplicationStateService) => {
    expect(service).toBeTruthy();
  }));
});
