import { TestBed } from '@angular/core/testing';

import { EmailCampaignService } from './email-campaign.service';

describe('EmailCampaignService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmailCampaignService = TestBed.get(EmailCampaignService);
    expect(service).toBeTruthy();
  });
});
