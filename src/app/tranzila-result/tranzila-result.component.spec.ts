import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranzilaResultcomponent } from './order-history.component';

describe('OrderHistoryComponent', () => {
  let component: TranzilaResultcomponent;
  let fixture: ComponentFixture<TranzilaResultcomponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranzilaResultcomponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranzilaResultcomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
