import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { YoutubePlayerComponent } from './youtube.component';
import { YoutubePlayerService } from './youtube.service';

@NgModule({
  declarations: [
    YoutubePlayerComponent
  ],
  exports: [
    YoutubePlayerComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    YoutubePlayerService
  ]
})
export class YoutubePlayerModule { }