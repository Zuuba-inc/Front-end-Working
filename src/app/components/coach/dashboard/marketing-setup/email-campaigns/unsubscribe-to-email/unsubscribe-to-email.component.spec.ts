import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubscribeToEmailComponent } from './unsubscribe-to-email.component';

describe('UnsubscribeToEmailComponent', () => {
  let component: UnsubscribeToEmailComponent;
  let fixture: ComponentFixture<UnsubscribeToEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsubscribeToEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsubscribeToEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
