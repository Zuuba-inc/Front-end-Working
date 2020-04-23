import { TestBed } from '@angular/core/testing';

import { EmailCommonService } from './email-common.service';

describe('EmailCommonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmailCommonService = TestBed.get(EmailCommonService);
    expect(service).toBeTruthy();
  });
});
