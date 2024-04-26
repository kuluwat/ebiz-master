import { TestBed } from '@angular/core/testing';

import { PartIService } from './part-i.service';

describe('PartIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PartIService = TestBed.get(PartIService);
    expect(service).toBeTruthy();
  });
});
