import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirticketComponent } from './airticket.component';

describe('AirticketComponent', () => {
  let component: AirticketComponent;
  let fixture: ComponentFixture<AirticketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirticketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirticketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
