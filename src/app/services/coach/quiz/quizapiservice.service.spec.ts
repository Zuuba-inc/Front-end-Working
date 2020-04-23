import { TestBed } from '@angular/core/testing';

import { QuizapiserviceService } from './quizapiservice.service';

describe('QuizapiserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuizapiserviceService = TestBed.get(QuizapiserviceService);
    expect(service).toBeTruthy();
  });
});
