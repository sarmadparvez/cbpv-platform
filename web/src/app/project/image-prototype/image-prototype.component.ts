import { Component, Input, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTaskDto, Image, Task } from 'gen/api/task/model/models';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ImageUploadModule } from '../image-uploader/image-upload.component';
import TestTypeEnum = CreateTaskDto.TestTypeEnum;
import { TasksService } from '../../../../gen/api/task';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxGalleryImage } from '@kolkov/ngx-gallery';
import { ImageViewerModule } from '../image-viewer/image-viewer.component';

type GalleryImage = NgxGalleryImage & {
  id: string;
};

@Component({
  selector: 'app-image-prototype',
  templateUrl: './image-prototype.component.html',
  styleUrls: ['./image-prototype.component.scss'],
})
export class ImagePrototypeComponent implements OnInit {
  @Input() task: ReplaySubject<Task>;
  TestTypeEnum = TestTypeEnum;
  images = new Map<number, ReplaySubject<GalleryImage[]>>();

  constructor(
    private readonly taskService: TasksService,
    private readonly snackbar: MatSnackBar,
    private readonly translateService: TranslateService,
  ) {
    Window['ipself'] = this;
  }

  ngOnInit() {
    this.findAllImages();
  }

  async findAllImages(splitNumber?: number) {
    const task = await firstValueFrom(this.task);
    try {
      const images = await firstValueFrom(
        this.taskService.findAllImages(task.id, splitNumber),
      );
      this.splitImagesInMap(images, splitNumber);
    } catch (err) {
      console.log('unable to fetch images ', err);
    }
  }

  async splitImagesInMap(images: Image[], splitNumber?: number) {
    if (!splitNumber) {
      const firstSplitImages = images.filter(i => i.splitNumber === 1);
      // first split should always exist if images exist because default split number is 1
      this.setImagesInMap(firstSplitImages, 1);
      const secondSplitImages = images.filter(i => i.splitNumber === 2);
      const task = await firstValueFrom(this.task);
      if (task.testType === TestTypeEnum.Split) {
        // only set second split images if they exist
        this.setImagesInMap(secondSplitImages, 2);
      }
    } else {
      this.setImagesInMap(images, splitNumber);
    }
  }

  setImagesInMap(images: Image[], splitNumber: number) {
    if (!this.images.has(splitNumber)) {
      this.initializeImageMapFor(splitNumber);
    }
    const galleryImages = this.imagesToGalleryImages(images);
    this.images.get(splitNumber).next(galleryImages);
  }

  imagesToGalleryImages(images: Image[]) {
    return images.map(
      img =>
        <GalleryImage>{
          small: img.url,
          medium: img.url,
          big: img.url,
          url: img.url,
          id: img.id,
        },
    );
  }

  initializeImageMapFor(splitNumber) {
    this.images.set(splitNumber, new ReplaySubject<Image[]>(1));
  }

  async deleteImage(deleteIndex: number, splitNumber: number) {
    const imagesSubject = this.images.get(splitNumber);

    const images = await firstValueFrom(imagesSubject);
    const task = await firstValueFrom(this.task);
    if (images[deleteIndex]) {
      try {
        const response = await firstValueFrom(
          this.taskService.removeImage(task.id, images[deleteIndex].id),
        );
        images.splice(deleteIndex, 1);
        imagesSubject.next([...images]);
      } catch (err) {
        console.log('failed deleting image ', err);
      }
    }
  }
}

/**
 * Project module
 * */
@NgModule({
  declarations: [ImagePrototypeComponent],
  exports: [ImagePrototypeComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    TranslateModule,
    ImageUploadModule,
    ImageViewerModule,
  ],
})
export class ImagePrototypeModule {}
