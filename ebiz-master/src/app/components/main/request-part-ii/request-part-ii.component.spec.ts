import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPartIIComponent } from './request-part-ii.component';

describe('RequestPartIIComponent', () => {
  let component: RequestPartIIComponent;
  let fixture: ComponentFixture<RequestPartIIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestPartIIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPartIIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
