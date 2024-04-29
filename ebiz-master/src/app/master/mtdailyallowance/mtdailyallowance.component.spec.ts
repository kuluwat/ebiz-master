import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtdailyallowanceComponent } from './mtdailyallowance.component';

describe('MtdailyallowanceComponent', () => {
  let component: MtdailyallowanceComponent;
  let fixture: ComponentFixture<MtdailyallowanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtdailyallowanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtdailyallowanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
