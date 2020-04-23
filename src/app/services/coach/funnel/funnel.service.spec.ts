import { TestBed } from '@angular/core/testing';

import { FunnelService } from './funnel.service';

describe('FunnelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FunnelService = TestBed.get(FunnelService);
    expect(service).toBeTruthy();
  });
});
