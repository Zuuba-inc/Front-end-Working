import { TestBed } from '@angular/core/testing';

import { WebinarAPIService } from './webinar-api.service';

describe('WebinarAPIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebinarAPIService = TestBed.get(WebinarAPIService);
    expect(service).toBeTruthy();
  });
});
