import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailCampaignListComponent } from './email-campaign-list.component';

describe('EmailCampaignListComponent', () => {
  let component: EmailCampaignListComponent;
  let fixture: ComponentFixture<EmailCampaignListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailCampaignListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailCampaignListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
