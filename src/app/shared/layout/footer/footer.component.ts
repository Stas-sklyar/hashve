import {Component, HostListener, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FooterLinks} from './footer';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  year: number = 0;
  curLang: string = 'heb';
  footerBlock1 = FooterLinks.block1;
  footerBlock2 = FooterLinks.block2;
  footerBlock3 = FooterLinks.block3;
  show: boolean = false;

  scrollTo(to: string) {
    if (isPlatformBrowser(this.platformId)) {
      document.body.scrollIntoView({behavior: 'smooth'});
    }
  }

  @HostListener('window:scroll', ['$event']) onWindowScroll(e) {
    if (isPlatformBrowser(this.platformId)) {
      let sensorTopPos = document.body.getBoundingClientRect().top * -1;
      if (sensorTopPos > 200) {
        this.show = true;
      } else {
        this.show = false;
      }
    }
  }

  constructor(transalteService: TranslateService, @Inject(PLATFORM_ID) private platformId) {
    this.curLang = transalteService.currentLang;
    transalteService.onLangChange.subscribe(lang => {
      this.curLang = lang.lang;
    });
    this.year = (new Date()).getFullYear();

  }

  ngOnInit() {
  }

}
