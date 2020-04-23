import { TestBed } from '@angular/core/testing';

import { FunnelAutomationRulesService } from './funnel-automation-rules.service';

describe('FunnelAutomationRulesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FunnelAutomationRulesService = TestBed.get(FunnelAutomationRulesService);
    expect(service).toBeTruthy();
  });
});
