import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingSetupComponent } from './marketing-setup.component';

describe('MarketingSetupComponent', () => {
  let component: MarketingSetupComponent;
  let fixture: ComponentFixture<MarketingSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
