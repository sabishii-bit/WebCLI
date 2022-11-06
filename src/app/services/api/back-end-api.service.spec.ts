import { TestBed } from '@angular/core/testing';

import { BackEndApiService } from './back-end-api.service';

describe('BackEndApiService', () => {
  let service: BackEndApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackEndApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
