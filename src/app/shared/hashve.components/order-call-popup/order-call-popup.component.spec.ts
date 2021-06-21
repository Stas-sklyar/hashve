import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCallPopupComponent } from './order-call-popup.component';

describe('OrderCallPopupComponent', () => {
  let component: OrderCallPopupComponent;
  let fixture: ComponentFixture<OrderCallPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderCallPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderCallPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
