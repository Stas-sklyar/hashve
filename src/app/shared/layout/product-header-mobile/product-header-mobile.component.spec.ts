import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductHeaderMobileComponent } from './product-header-mobile.component';

describe('ProductHeaderMobileComponent', () => {
  let component: ProductHeaderMobileComponent;
  let fixture: ComponentFixture<ProductHeaderMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductHeaderMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductHeaderMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
