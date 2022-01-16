// Uses https://www.npmjs.com/package/@kolkov/ngx-gallery package to show images
// Based on example from this library https://www.npmjs.com/package/@kolkov/ngx-gallery

import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgxGalleryAction,
  NgxGalleryAnimation,
  NgxGalleryImage,
  NgxGalleryModule,
  NgxGalleryOptions,
} from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent implements OnInit {
  options: NgxGalleryOptions[];
  @Input() images: NgxGalleryImage[] = [];

  @Input() readonly: boolean;

  @Output() deleteEvent = new EventEmitter<number>();

  constructor() {
    Window['ivself'] = this;
  }

  ngOnInit(): void {
    this.removeProblematicStyle();
    this.setOptions();
  }

  setOptions() {
    const actions: NgxGalleryAction[] = [
      {
        icon: 'fa fa-trash',
        titleText: 'Delete Image',
        onClick: (event: Event, index: number) => {
          this.deleteEvent.emit(index);
        },
      },
    ];
    let options: NgxGalleryOptions = {};
    if (!this.readonly) {
      options = {
        imageActions: actions,
        thumbnailActions: actions,
      };
    }
    this.options = [
      {
        width: '600px',
        height: '500px',
        thumbnailsColumns: 5,
        imageAnimation: NgxGalleryAnimation.Slide,
        previewCloseOnClick: true,
        ...options,
      },
      // max-width 1000
      {
        breakpoint: 1000,
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsColumns: 3,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20,
        previewCloseOnClick: true,
        ...options,
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false,
        ...options,
      },
    ];
  }

  /**
   * Workaround for the issue https://github.com/kolkov/ngx-gallery/issues/14
   */
  removeProblematicStyle() {
    const styles = document.getElementsByTagName('style');
    let style;
    for (let i = 0; i < styles.length; i++) {
      if (styles[i].innerText.includes('*{box-sizing:border-box')) {
        style = styles[i];
      }
    }
    if (style) {
      style.innerText = style.innerText.replace('*{box-sizing:border-box}', '');
    }
  }
}

/**
 * Image Viewer Module
 * */
@NgModule({
  imports: [CommonModule, NgxGalleryModule],
  declarations: [ImageViewerComponent],
  exports: [ImageViewerComponent],
})
export class ImageViewerModule {}
