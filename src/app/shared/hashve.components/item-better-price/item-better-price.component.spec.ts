import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemBetterPriceComponent } from './item-better-price.component';

describe('ItemSearchComponent', () => {
  let component: ItemBetterPriceComponent;
  let fixture: ComponentFixture<ItemBetterPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemBetterPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemBetterPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
