import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWebinarComponent } from './list-webinar.component';

describe('ListWebinarComponent', () => {
  let component: ListWebinarComponent;
  let fixture: ComponentFixture<ListWebinarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListWebinarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWebinarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
