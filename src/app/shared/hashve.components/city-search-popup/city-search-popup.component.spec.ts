import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitySearchPopupComponent } from './city-search-popup.component';

describe('CitySearchPopupComponent', () => {
  let component: CitySearchPopupComponent;
  let fixture: ComponentFixture<CitySearchPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitySearchPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitySearchPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
