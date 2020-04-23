import { TestBed } from '@angular/core/testing';

import { QuizQuestionsService } from './quiz-questions.service';

describe('QuizQuestionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuizQuestionsService = TestBed.get(QuizQuestionsService);
    expect(service).toBeTruthy();
  });
});
