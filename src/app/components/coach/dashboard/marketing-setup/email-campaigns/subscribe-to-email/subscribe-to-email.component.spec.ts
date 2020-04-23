import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeToEmailComponent } from './subscribe-to-email.component';

describe('SubscribeToEmailComponent', () => {
  let component: SubscribeToEmailComponent;
  let fixture: ComponentFixture<SubscribeToEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribeToEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribeToEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
