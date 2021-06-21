import {AfterViewInit, Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AppService} from '../../../app.service';
import {ItemSize} from '../../../business/Enum/ItemSize';

@Component({
  selector: 'app-size-sticker',
  templateUrl: './size-sticker.component.html',
  styleUrls: ['./size-sticker.component.scss']
})
export class SizeStickerComponent implements OnInit, AfterViewInit {
  curLang: string = 'heb';
  _itemSize = ItemSize;
  @Input() size: ItemSize = ItemSize.normal;

  constructor(private translateSrv: TranslateService, private appService: AppService, @Inject(PLATFORM_ID) private platformId) {
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe(lang => {
      this.curLang = lang.lang;
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

  }
}
