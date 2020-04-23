import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSequenceComponent } from './email-sequence.component';

describe('EmailSequenceComponent', () => {
  let component: EmailSequenceComponent;
  let fixture: ComponentFixture<EmailSequenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailSequenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
