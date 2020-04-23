import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadContactListComponent } from './upload-contact-list.component';

describe('UploadContactListComponent', () => {
  let component: UploadContactListComponent;
  let fixture: ComponentFixture<UploadContactListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadContactListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadContactListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
