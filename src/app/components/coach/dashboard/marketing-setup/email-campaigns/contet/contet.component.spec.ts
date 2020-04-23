import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContetComponent } from './contet.component';

describe('ContetComponent', () => {
  let component: ContetComponent;
  let fixture: ComponentFixture<ContetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
