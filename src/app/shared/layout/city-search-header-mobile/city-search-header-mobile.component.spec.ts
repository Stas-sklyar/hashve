import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitySearchHeaderMobileComponent } from './city-search-header-mobile.component';

describe('CitySearchHeaderMobileComponent', () => {
  let component: CitySearchHeaderMobileComponent;
  let fixture: ComponentFixture<CitySearchHeaderMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitySearchHeaderMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitySearchHeaderMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
