import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoWebinarStremPageComponent } from './auto-webinar-strem-page.component';

describe('AutoWebinarStremPageComponent', () => {
  let component: AutoWebinarStremPageComponent;
  let fixture: ComponentFixture<AutoWebinarStremPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoWebinarStremPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoWebinarStremPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
