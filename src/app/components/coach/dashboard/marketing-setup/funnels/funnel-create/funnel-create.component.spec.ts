import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunnelCreateComponent } from './funnel-create.component';

describe('FunnelCreateComponent', () => {
  let component: FunnelCreateComponent;
  let fixture: ComponentFixture<FunnelCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunnelCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunnelCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
