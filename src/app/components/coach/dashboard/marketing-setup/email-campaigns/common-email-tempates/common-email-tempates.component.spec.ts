import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonEmailTempatesComponent } from './common-email-tempates.component';

describe('CommonEmailTempatesComponent', () => {
  let component: CommonEmailTempatesComponent;
  let fixture: ComponentFixture<CommonEmailTempatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonEmailTempatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonEmailTempatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
