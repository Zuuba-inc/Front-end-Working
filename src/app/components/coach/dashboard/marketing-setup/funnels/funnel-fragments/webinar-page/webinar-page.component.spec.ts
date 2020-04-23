import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebinarPageComponent } from './webinar-page.component';

describe('WebinarPageComponent', () => {
  let component: WebinarPageComponent;
  let fixture: ComponentFixture<WebinarPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebinarPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebinarPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
