import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingBgColorComponent } from './loading-bg-color.component';

describe('LoadingBgColorComponent', () => {
  let component: LoadingBgColorComponent;
  let fixture: ComponentFixture<LoadingBgColorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingBgColorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingBgColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
