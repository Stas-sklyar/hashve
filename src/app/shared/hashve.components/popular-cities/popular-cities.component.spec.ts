import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularCitiesComponent } from './popular-cities.component';

describe('PopularCitiesComponent', () => {
  let component: PopularCitiesComponent;
  let fixture: ComponentFixture<PopularCitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopularCitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularCitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
