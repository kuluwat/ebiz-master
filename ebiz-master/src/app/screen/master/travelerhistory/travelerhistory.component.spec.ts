import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelerhistoryComponent } from './travelerhistory.component';

describe('TravelerhistoryComponent', () => {
  let component: TravelerhistoryComponent;
  let fixture: ComponentFixture<TravelerhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelerhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelerhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
