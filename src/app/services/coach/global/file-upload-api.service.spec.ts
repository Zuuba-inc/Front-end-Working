import { TestBed } from '@angular/core/testing';

import { FileUploadAPIService } from './file-upload-api.service';

describe('FileUploadAPIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileUploadAPIService = TestBed.get(FileUploadAPIService);
    expect(service).toBeTruthy();
  });
});
