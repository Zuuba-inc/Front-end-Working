import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentationRuleComponent } from './segmentation-rule.component';

describe('SegmentationRuleComponent', () => {
  let component: SegmentationRuleComponent;
  let fixture: ComponentFixture<SegmentationRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegmentationRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentationRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
