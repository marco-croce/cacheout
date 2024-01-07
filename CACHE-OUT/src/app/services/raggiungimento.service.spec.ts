import { TestBed } from '@angular/core/testing';

import { RaggiungimentoService } from './raggiungimento.service';

describe('RaggiungimentoService', () => {
  let service: RaggiungimentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RaggiungimentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
