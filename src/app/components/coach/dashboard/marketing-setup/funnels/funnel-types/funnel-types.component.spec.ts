import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunnelTypesComponent } from './funnel-types.component';

describe('FunnelTypesComponent', () => {
  let component: FunnelTypesComponent;
  let fixture: ComponentFixture<FunnelTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunnelTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunnelTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
