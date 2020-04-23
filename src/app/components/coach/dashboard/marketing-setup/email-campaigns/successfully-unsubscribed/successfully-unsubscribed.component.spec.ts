import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessfullyUnsubscribedComponent } from './successfully-unsubscribed.component';

describe('SuccessfullyUnsubscribedComponent', () => {
  let component: SuccessfullyUnsubscribedComponent;
  let fixture: ComponentFixture<SuccessfullyUnsubscribedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessfullyUnsubscribedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessfullyUnsubscribedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
