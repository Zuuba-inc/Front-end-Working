import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizDesignComponent } from './quiz-design.component';

describe('QuizDesignComponent', () => {
  let component: QuizDesignComponent;
  let fixture: ComponentFixture<QuizDesignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizDesignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
