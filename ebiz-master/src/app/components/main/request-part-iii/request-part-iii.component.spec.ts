import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPartIIIComponent } from './request-part-iii.component';

describe('RequestPartIIIComponent', () => {
  let component: RequestPartIIIComponent;
  let fixture: ComponentFixture<RequestPartIIIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestPartIIIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPartIIIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
