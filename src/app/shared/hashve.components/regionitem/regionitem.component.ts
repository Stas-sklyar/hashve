import { AfterContentInit, Component, Input, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Region } from "../../../business/model/region.model";

@Component({
  selector: "app-regionitem",
  templateUrl: "./regionitem.component.html",
  styleUrls: ["./regionitem.component.scss"],
})
export class RegionItemComponent implements OnInit, AfterContentInit {
  curLang: string = "heb";

  @Input() additionClass: string;
  @Input() region: any;
  @Input() categories: any;
  @Input() dayDealCount: number;

  constructor(private translateSrv: TranslateService) {
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe((lang) => {
      this.curLang = lang.lang;
    });
  }

  ngAfterContentInit() {
    // let flag = false;
    if (this.region && !this.region.link2) {
      this.region.link2 =
        "משלוחי_פרחים_ב" + this.region.name[this.curLang].replace(/\s/g, "_");
    }
  }

  ngOnInit() {}
}
