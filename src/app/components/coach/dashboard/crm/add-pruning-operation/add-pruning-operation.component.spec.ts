import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPruningOperationComponent } from './add-pruning-operation.component';

describe('AddPruningOperationComponent', () => {
  let component: AddPruningOperationComponent;
  let fixture: ComponentFixture<AddPruningOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPruningOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPruningOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
