import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprovePriceComponent } from './improve-price.component';

describe('ImprovePriceComponent', () => {
  let component: ImprovePriceComponent;
  let fixture: ComponentFixture<ImprovePriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImprovePriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprovePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
