import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsosComponent } from './isos.component';

describe('IsosComponent', () => {
  let component: IsosComponent;
  let fixture: ComponentFixture<IsosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
