import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HashveBannerComponent } from './hashve-banner.component';

describe('HashveBannerComponent', () => {
  let component: HashveBannerComponent;
  let fixture: ComponentFixture<HashveBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HashveBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HashveBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
