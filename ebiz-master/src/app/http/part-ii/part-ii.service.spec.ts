import { TestBed } from '@angular/core/testing';

import { PartIiService } from './part-ii.service';

describe('PartIiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PartIiService = TestBed.get(PartIiService);
    expect(service).toBeTruthy();
  });
});
