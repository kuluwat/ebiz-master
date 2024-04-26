import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPartIComponent } from './request-part-i.component';

describe('RequestPartIComponent', () => {
  let component: RequestPartIComponent;
  let fixture: ComponentFixture<RequestPartIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestPartIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPartIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
