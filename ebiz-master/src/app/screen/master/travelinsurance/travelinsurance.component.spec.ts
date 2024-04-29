import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelinsuranceComponent } from './travelinsurance.component';

describe('TravelinsuranceComponent', () => {
  let component: TravelinsuranceComponent;
  let fixture: ComponentFixture<TravelinsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelinsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelinsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
