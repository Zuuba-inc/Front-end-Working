import { TestBed } from '@angular/core/testing';

import { WebinarConfigureService } from './webinar-configure.service';

describe('WebinarConfigurService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebinarConfigureService = TestBed.get(WebinarConfigureService);
    expect(service).toBeTruthy();
  });
});
