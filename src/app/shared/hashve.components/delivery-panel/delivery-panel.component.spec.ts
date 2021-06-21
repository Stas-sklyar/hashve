import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryPanelComponent } from './delivery-panel.component';

describe('DeliveryPanelComponent', () => {
  let component: DeliveryPanelComponent;
  let fixture: ComponentFixture<DeliveryPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
