import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtbookingstatusComponent } from './mtbookingstatus.component';

describe('MtbookingstatusComponent', () => {
  let component: MtbookingstatusComponent;
  let fixture: ComponentFixture<MtbookingstatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtbookingstatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtbookingstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
