import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankyouPreviewComponent } from './thankyou-preview.component';

describe('ThankyouPreviewComponent', () => {
  let component: ThankyouPreviewComponent;
  let fixture: ComponentFixture<ThankyouPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThankyouPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThankyouPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
