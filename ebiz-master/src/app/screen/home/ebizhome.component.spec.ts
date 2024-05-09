import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EbizhomeComponent } from './ebizhome.component';

describe('EbizhomeComponent', () => {
  let component: EbizhomeComponent;
  let fixture: ComponentFixture<EbizhomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EbizhomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EbizhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
