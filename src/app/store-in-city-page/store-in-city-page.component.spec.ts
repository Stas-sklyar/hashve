import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreInCityPageComponent } from './store-in-city-page.component';

describe('StoreInCityComponent', () => {
  let component: StoreInCityPageComponent;
  let fixture: ComponentFixture<StoreInCityPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreInCityPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreInCityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
