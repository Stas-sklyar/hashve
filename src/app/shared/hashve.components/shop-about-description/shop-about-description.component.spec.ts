import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopAboutDescriptionComponent } from './shop-about-description.component';

describe('ShopAboutDescriptionComponent', () => {
  let component: ShopAboutDescriptionComponent;
  let fixture: ComponentFixture<ShopAboutDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopAboutDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopAboutDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
