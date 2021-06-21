import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemWishComponent } from './item-component.component';

describe('ItemSearchComponent', () => {
  let component: ItemWishComponent;
  let fixture: ComponentFixture<ItemWishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemWishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemWishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
