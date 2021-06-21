import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HashveSliderComponent } from './hashve-slider.component';

describe('HashveSliderComponent', () => {
  let component: HashveSliderComponent;
  let fixture: ComponentFixture<HashveSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HashveSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HashveSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
