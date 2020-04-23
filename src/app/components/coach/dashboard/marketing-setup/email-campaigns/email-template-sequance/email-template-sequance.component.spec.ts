import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTemplateSequanceComponent } from './email-template-sequance.component';

describe('EmailTemplateSequanceComponent', () => {
  let component: EmailTemplateSequanceComponent;
  let fixture: ComponentFixture<EmailTemplateSequanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailTemplateSequanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTemplateSequanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
