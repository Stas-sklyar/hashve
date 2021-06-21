import { Component, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Store } from "../../../business/model/store.model";
import { City } from "../../../business/model/city.model";
import { ActivatedRoute } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { TranslateService } from "@ngx-translate/core";
import {} from "googlemaps";
import { EventEmitter } from "events";
import { Subject } from "rxjs";

@Component({
  selector: "app-store-popup",
  templateUrl: "./store-popup.component.html",
  styleUrls: ["./store-popup.component.scss"],
})
export class StorePopupComponent implements OnDestroy, OnInit {
  private styleTag: HTMLStyleElement;
  data: any;
  store: Store;
  curLang: string;
  city: City;
  @Input() renderClose = true;
  @Input() stores: Store;
  @Input() link: string = "";
  @Output() onClosePopup: Subject<boolean> = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private translateSrv: TranslateService
  ) {
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe((lang) => {
      this.curLang = lang.lang;
    });
    this.data = this.route.snapshot.data.payload;
    this.store = this.data.store;
    this.city = this.store.city;
  }

  ngOnDestroy(): void {
    document.body.removeChild(this.styleTag);
  }

  close() {
    if (this.store.adminActive) {
      this.onClosePopup.next(true);
    }
  }

  ngOnInit() {
    this.styleTag = this.buildStyleElement();
    document.body.appendChild(this.styleTag);
  }

  buildStyleElement() {
    var style = document.createElement("style");
    style.type = "text/css";
    style.setAttribute("data-debug", "Injected by store-popup.");
    style.textContent = `
            body {
                overflow: hidden !important ;
            }
        `;
    return style;
  }
}
