import { TestBed } from '@angular/core/testing';

import { LoadListService } from './load-list.service';

describe('LoadListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoadListService = TestBed.get(LoadListService);
    expect(service).toBeTruthy();
  });
});
