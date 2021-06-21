import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsItemComponent } from './analytics-item.component';

describe('AnalyticsItemComponent', () => {
  let component: AnalyticsItemComponent;
  let fixture: ComponentFixture<AnalyticsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
