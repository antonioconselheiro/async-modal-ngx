import { TestBed } from '@angular/core/testing';

import { AsyncModalNgxService } from './async-modal-ngx.service';

describe('AsyncModalNgxService', () => {
  let service: AsyncModalNgxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsyncModalNgxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
