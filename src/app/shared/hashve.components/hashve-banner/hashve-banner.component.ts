import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-hashve-banner',
  templateUrl: './hashve-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./hashve-banner.component.scss']
})
export class HashveBannerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
