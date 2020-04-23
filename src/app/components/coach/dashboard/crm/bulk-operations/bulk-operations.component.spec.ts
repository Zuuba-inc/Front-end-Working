import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkOperationsComponent } from './bulk-operations.component';

describe('BulkOperationsComponent', () => {
  let component: BulkOperationsComponent;
  let fixture: ComponentFixture<BulkOperationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkOperationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
