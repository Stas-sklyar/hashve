import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeStickerComponent } from './item.component';

describe('ItemComponent', () => {
  let component: SizeStickerComponent;
  let fixture: ComponentFixture<SizeStickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SizeStickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SizeStickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
