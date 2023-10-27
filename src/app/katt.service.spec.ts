import { TestBed } from '@angular/core/testing';

import { KattService } from './katt.service';

describe('KattService', () => {
  let service: KattService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KattService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
