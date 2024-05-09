import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogindevComponent } from './logindev.component';

describe('LogindevComponent', () => {
  let component: LogindevComponent;
  let fixture: ComponentFixture<LogindevComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogindevComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogindevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
