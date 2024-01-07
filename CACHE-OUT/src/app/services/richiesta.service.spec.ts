import { TestBed } from '@angular/core/testing';

import { RichiestaService } from './richiesta.service';

describe('RichiestaService', () => {
  let service: RichiestaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RichiestaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
