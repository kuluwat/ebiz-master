import { TestBed } from '@angular/core/testing';

import { PartIiiiService } from './part-iiii.service';

describe('PartIiiiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PartIiiiService = TestBed.get(PartIiiiService);
    expect(service).toBeTruthy();
  });
});
