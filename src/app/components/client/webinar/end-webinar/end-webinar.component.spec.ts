import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndWebinarComponent } from './end-webinar.component';

describe('EndWebinarComponent', () => {
  let component: EndWebinarComponent;
  let fixture: ComponentFixture<EndWebinarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndWebinarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndWebinarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
