import { TestBed } from '@angular/core/testing';

import { GeocacherService } from './geocacher.service';

describe('GeocacherService', () => {
  let service: GeocacherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeocacherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
