import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebinarInfoComponent } from './webinar-info.component';

describe('WebinarInfoComponent', () => {
  let component: WebinarInfoComponent;
  let fixture: ComponentFixture<WebinarInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebinarInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebinarInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
