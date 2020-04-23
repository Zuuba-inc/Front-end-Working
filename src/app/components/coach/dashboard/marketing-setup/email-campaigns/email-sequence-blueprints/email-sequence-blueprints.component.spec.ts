import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSequenceBlueprintsComponent } from './email-sequence-blueprints.component';

describe('EmailSequenceBlueprintsComponent', () => {
  let component: EmailSequenceBlueprintsComponent;
  let fixture: ComponentFixture<EmailSequenceBlueprintsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailSequenceBlueprintsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailSequenceBlueprintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
