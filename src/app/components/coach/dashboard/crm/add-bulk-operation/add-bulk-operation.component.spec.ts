import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBulkOperationComponent } from './add-bulk-operation.component';

describe('AddBulkOperationComponent', () => {
  let component: AddBulkOperationComponent;
  let fixture: ComponentFixture<AddBulkOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBulkOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBulkOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
