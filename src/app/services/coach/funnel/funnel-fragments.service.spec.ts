import { TestBed } from '@angular/core/testing';

import { FunnelFragmentsService } from './funnel-fragments.service';

describe('FunnelFragmentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FunnelFragmentsService = TestBed.get(FunnelFragmentsService);
    expect(service).toBeTruthy();
  });
});
