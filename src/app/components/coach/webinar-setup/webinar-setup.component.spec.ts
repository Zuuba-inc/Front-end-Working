import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebinarSetupComponent } from './webinar-setup.component';

describe('WebinarSetupComponent', () => {
  let component: WebinarSetupComponent;
  let fixture: ComponentFixture<WebinarSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebinarSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebinarSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
