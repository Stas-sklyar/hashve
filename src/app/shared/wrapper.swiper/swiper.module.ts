import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SwiperComponent } from './swiper.component';

@NgModule({
  imports: [CommonModule, RouterModule, TranslateModule],
  declarations: [SwiperComponent],
  exports: [SwiperComponent],
})
export class ComponentModule {}
