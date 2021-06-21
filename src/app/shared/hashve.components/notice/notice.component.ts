import { TranslateService } from "@ngx-translate/core";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";

@Component({
  selector: "[app-notice]",
  templateUrl: "./notice.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["./notice.component.scss"],
})
export class NoticeComponent implements OnInit {
  @Input() banner: any = null;
  curLang = "heb";
  constructor(private translateSrv: TranslateService) {
    this.curLang = this.translateSrv.currentLang;
    this.translateSrv.onLangChange.subscribe((lang) => {
      this.curLang = lang.lang;
    });
  }

  ngOnInit() {}
}
