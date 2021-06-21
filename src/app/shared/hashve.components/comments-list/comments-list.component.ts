import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {Rate} from '../../../business/model/rate.model';
import {RateService} from '../../service/rate.service';
import {isPlatformServer} from '@angular/common';

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./comments-list.component.scss']
})
export class CommentsListComponent implements OnInit, AfterViewInit {
  @Input() reviews: Array<Rate> = [];
  // @Input() allReviews: boolean = false;
  @Input() itemId: string = '';
  @Input() type: number = 0;
  @Input() rating: number = 0;
  @Input() reviewCount: number = 0;
  serverFlag: boolean = false;
  constructor(private rateService: RateService, @Inject(PLATFORM_ID) private platformId, private cdr: ChangeDetectorRef) {
    this.serverFlag = isPlatformServer(this.platformId);
  }

  ngOnInit() {
  }

  addComments(){
    this.rateService.getRates(this.type, this.itemId, this.reviews.length, 5).subscribe(data => {
      this.reviews = [...this.reviews, ...data];
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    if(this.reviews.length === 0){
      this.addComments();
    }
  }
}
