import { TestBed } from '@angular/core/testing';

import { PartIiiService } from './part-iii.service';

describe('PartIiiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PartIiiService = TestBed.get(PartIiiService);
    expect(service).toBeTruthy();
  });
});
