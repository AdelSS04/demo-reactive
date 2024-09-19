import { TestBed } from '@angular/core/testing';

import { FgServiceService } from './fg-service.service';

describe('FgServiceService', () => {
  let service: FgServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FgServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
