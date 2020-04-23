import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailBroadcastOneComponent } from './email-broadcast-one.component';

describe('EmailBroadcastOneComponent', () => {
  let component: EmailBroadcastOneComponent;
  let fixture: ComponentFixture<EmailBroadcastOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailBroadcastOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailBroadcastOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
