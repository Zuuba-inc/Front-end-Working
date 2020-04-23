import { TestBed } from '@angular/core/testing';

import { FunnelConfigService } from './funnel-config.service';

describe('FunnelConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FunnelConfigService = TestBed.get(FunnelConfigService);
    expect(service).toBeTruthy();
  });
});
