import { TestBed } from '@angular/core/testing';

import { AuthapiserviceService } from './authapiservice.service';

describe('AuthapiserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthapiserviceService = TestBed.get(AuthapiserviceService);
    expect(service).toBeTruthy();
  });
});
