import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveWebinarStreamPageComponent } from './live-webinar-stream-page.component';

describe('LiveWebinarStreamPageComponent', () => {
  let component: LiveWebinarStreamPageComponent;
  let fixture: ComponentFixture<LiveWebinarStreamPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveWebinarStreamPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveWebinarStreamPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
