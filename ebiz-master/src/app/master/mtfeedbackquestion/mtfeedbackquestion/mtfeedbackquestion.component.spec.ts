import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtfeedbackquestionComponent } from './mtfeedbackquestion.component';

describe('MtfeedbackquestionComponent', () => {
  let component: MtfeedbackquestionComponent;
  let fixture: ComponentFixture<MtfeedbackquestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtfeedbackquestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtfeedbackquestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
