import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PruningOperationComponent } from './pruning-operation.component';

describe('PruningOperationComponent', () => {
  let component: PruningOperationComponent;
  let fixture: ComponentFixture<PruningOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PruningOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PruningOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
