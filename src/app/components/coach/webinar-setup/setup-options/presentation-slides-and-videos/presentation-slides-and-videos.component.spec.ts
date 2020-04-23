import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationSlidesAndVideosComponent } from './presentation-slides-and-videos.component';

describe('PresentationSlidesAndVideosComponent', () => {
  let component: PresentationSlidesAndVideosComponent;
  let fixture: ComponentFixture<PresentationSlidesAndVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresentationSlidesAndVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresentationSlidesAndVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
