import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunnelFragmentsComponent } from './funnel-fragments.component';

describe('FunnelFragmentsComponent', () => {
  let component: FunnelFragmentsComponent;
  let fixture: ComponentFixture<FunnelFragmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunnelFragmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunnelFragmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
