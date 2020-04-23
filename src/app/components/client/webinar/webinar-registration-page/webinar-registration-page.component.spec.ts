import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebinarRegistrationPageComponent } from './webinar-registration-page.component';

describe('WebinarRegistrationPageComponent', () => {
  let component: WebinarRegistrationPageComponent;
  let fixture: ComponentFixture<WebinarRegistrationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebinarRegistrationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebinarRegistrationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
