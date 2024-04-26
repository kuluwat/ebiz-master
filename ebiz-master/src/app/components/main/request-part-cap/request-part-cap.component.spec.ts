import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPartCapComponent } from './request-part-cap.component';

describe('RequestPartCapComponent', () => {
  let component: RequestPartCapComponent;
  let fixture: ComponentFixture<RequestPartCapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestPartCapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPartCapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
