import { TestBed } from '@angular/core/testing';

import { FileuploadserviceService } from './fileuploadservice.service';

describe('FileuploadserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileuploadserviceService = TestBed.get(FileuploadserviceService);
    expect(service).toBeTruthy();
  });
});
