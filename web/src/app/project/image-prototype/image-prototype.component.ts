import { Component, Input, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTaskDto, Image, Task } from 'gen/api/task/model/models';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ImageUploadModule } from '../image-upload/image-upload.component';
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
  @Input() readonly: boolean;
  TestTypeEnum = TestTypeEnum;
  TaskStatusEnum = Task.StatusEnum;
  images = new Map<number, ReplaySubject<GalleryImage[]>>();
  showViewer = false;

  constructor(private readonly taskService: TasksService) {
    Window['ipself'] = this;
  }

  ngOnInit() {
    if (this.task) {
      this.task.subscribe(async task => {
        this.showViewer = false;
        await this.findAllImages();
        this.showViewer = true;
      });
    }
  }

  async findAllImages(prototypeNumber?: number) {
    const task = await firstValueFrom(this.task);
    try {
      const images = await firstValueFrom(
        this.taskService.findAllImages(task.id, prototypeNumber),
      );
      this.divideImagesInMap(images, prototypeNumber);
    } catch (err) {
      console.log('unable to fetch images ', err);
    }
  }

  async divideImagesInMap(images: Image[], prototypeNumber?: number) {
    if (!prototypeNumber) {
      const firstPrototypeImages = images.filter(i => i.prototypeNumber === 1);
      // first comparison should always exist if images exist because default comparison number is 1
      this.setImagesInMap(firstPrototypeImages, 1);
      const secondPrototypeImages = images.filter(i => i.prototypeNumber === 2);
      const task = await firstValueFrom(this.task);
      if (task.testType === TestTypeEnum.Comparison) {
        // only set second comparison images if they exist
        this.setImagesInMap(secondPrototypeImages, 2);
      }
    } else {
      this.setImagesInMap(images, prototypeNumber);
    }
  }

  setImagesInMap(images: Image[], prototypeNumber: number) {
    if (!this.images.has(prototypeNumber)) {
      this.initializeImageMapFor(prototypeNumber);
    }
    const galleryImages = this.imagesToGalleryImages(images);
    this.images.get(prototypeNumber).next(galleryImages);
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

  initializeImageMapFor(prototypeNumber: number) {
    this.images.set(prototypeNumber, new ReplaySubject<Image[]>(1));
  }

  async deleteImage(deleteIndex: number, prototypeNumber: number) {
    const task = await firstValueFrom(this.task);
    if (task.status !== Task.StatusEnum.Draft) {
      return;
    }

    const imagesSubject = this.images.get(prototypeNumber);
    const images = await firstValueFrom(imagesSubject);

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
