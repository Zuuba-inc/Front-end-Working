import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpentokDemoComponent } from './opentok-demo.component';

describe('OpentokDemoComponent', () => {
  let component: OpentokDemoComponent;
  let fixture: ComponentFixture<OpentokDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpentokDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpentokDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
