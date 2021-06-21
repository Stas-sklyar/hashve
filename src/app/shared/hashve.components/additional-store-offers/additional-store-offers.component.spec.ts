import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalStoreOffersComponent } from './additional-store-offers.component';

describe('AdditionalStoreOffersComponent', () => {
  let component: AdditionalStoreOffersComponent;
  let fixture: ComponentFixture<AdditionalStoreOffersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalStoreOffersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalStoreOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
