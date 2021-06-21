import { Component, OnInit, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-hashve-slider",
  templateUrl: "./hashve-slider.component.html",
  styleUrls: ["./hashve-slider.component.scss"],
})
export class HashveSliderComponent implements OnInit {
  @Input() slider: any;
  curLang: string = "heb";
  constructor(private translateSrv: TranslateService) {
    this.curLang = translateSrv.currentLang;
  }
  config1: any = {
    loop: true,
    autoplay: {
      delay: 15000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  };
  ngOnInit() {}
}
