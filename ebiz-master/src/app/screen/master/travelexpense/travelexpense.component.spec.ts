import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelexpenseComponent } from './travelexpense.component';

describe('TravelexpenseComponent', () => {
  let component: TravelexpenseComponent;
  let fixture: ComponentFixture<TravelexpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelexpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelexpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
