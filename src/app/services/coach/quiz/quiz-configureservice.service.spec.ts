import { TestBed } from '@angular/core/testing';

import { QuizConfigureserviceService } from './quiz-configureservice.service';

describe('QuizConfigureserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuizConfigureserviceService = TestBed.get(QuizConfigureserviceService);
    expect(service).toBeTruthy();
  });
});
