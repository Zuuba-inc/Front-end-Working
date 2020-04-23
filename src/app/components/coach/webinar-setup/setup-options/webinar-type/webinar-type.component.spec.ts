import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebinarTypeComponent } from './webinar-type.component';

describe('WebinarTypeComponent', () => {
  let component: WebinarTypeComponent;
  let fixture: ComponentFixture<WebinarTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebinarTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebinarTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
