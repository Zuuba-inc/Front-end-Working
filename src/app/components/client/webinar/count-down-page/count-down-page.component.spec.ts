import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountDownPageComponent } from './count-down-page.component';

describe('CountDownPageComponent', () => {
  let component: CountDownPageComponent;
  let fixture: ComponentFixture<CountDownPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountDownPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountDownPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
