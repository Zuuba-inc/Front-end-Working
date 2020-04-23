import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizSetupComponent } from './quiz-setup.component';

describe('QuizSetupComponent', () => {
  let component: QuizSetupComponent;
  let fixture: ComponentFixture<QuizSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
