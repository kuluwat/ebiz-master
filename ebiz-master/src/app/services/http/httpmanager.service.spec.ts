import { TestBed } from '@angular/core/testing';

import { HttpmanagerService } from './httpmanager.service';

describe('HttpmanagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpmanagerService = TestBed.get(HttpmanagerService);
    expect(service).toBeTruthy();
  });
});
