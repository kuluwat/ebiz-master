import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtalreadybookedComponent } from './mtalreadybooked.component';

describe('MtalreadybookedComponent', () => {
  let component: MtalreadybookedComponent;
  let fixture: ComponentFixture<MtalreadybookedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtalreadybookedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtalreadybookedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
