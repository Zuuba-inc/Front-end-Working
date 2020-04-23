import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunnelsListComponent } from './funnels-list.component';

describe('FunnelsListComponent', () => {
  let component: FunnelsListComponent;
  let fixture: ComponentFixture<FunnelsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunnelsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunnelsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
