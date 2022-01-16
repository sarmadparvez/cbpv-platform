import { Component, Input, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import { CreateTaskDto, Task } from '../../../../gen/api/task';
import TestTypeEnum = CreateTaskDto.TestTypeEnum;
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { MatDividerModule } from '@angular/material/divider';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@angular/flex-layout';
import {
  IframeFormComponent,
  IframeFormData,
} from '../iframe-form/iframe-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-iframe-prototype',
  templateUrl: './iframe-prototype.component.html',
  styleUrls: ['./iframe-prototype.component.scss'],
})
export class IframePrototypeComponent implements OnInit {
  @Input() task: ReplaySubject<Task>;
  TaskStatusEnum = Task.StatusEnum;
  TestTypeEnum = TestTypeEnum;
  figmaEmbedUrl = 'https://www.figma.com/embed?embed_host=share&url=';
  safeIframeUrl1 = new ReplaySubject<SafeResourceUrl>(1);
  safeIframeUrl2 = new ReplaySubject<SafeResourceUrl>(1);

  constructor(
    public sanitizer: DomSanitizer,
    private readonly dialog: MatDialog,
  ) {
    Window['ipself'] = this;
  }

  async ngOnInit() {
    const task = await firstValueFrom(this.task);
    this.loadIframe(task);
  }

  loadIframe(task: Task) {
    if (task.iframeUrl1) {
      const safeUrl = this.getSafeUrl(task.iframeUrl1);
      this.safeIframeUrl1.next(safeUrl);
    }
    if (task.iframeUrl2) {
      const safeUrl = this.getSafeUrl(task.iframeUrl2);
      this.safeIframeUrl2.next(safeUrl);
    }
  }

  getSafeUrl(url: string) {
    if (this.isFigmaUrl(url)) {
      url = this.figmaEmbedUrl + url;
    }
    if (decodeURI(url) === url) {
      // if decoding the url results in the same url, then it means url is not decoded
      url = encodeURI(url);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  isFigmaUrl(url: string) {
    return /https:\/\/([\w\.-]+\.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/.test(
      url,
    );
  }

  async openEditDialog(urlNo: number) {
    const task = await firstValueFrom(this.task);

    this.dialog
      .open(IframeFormComponent, {
        data: <IframeFormData>{
          splitNo: urlNo,
          task: task,
        },
        disableClose: true,
        width: '45vw',
      })
      .afterClosed()
      .subscribe((url: string) => {
        if (url) {
          const safeResourceUrl = this.getSafeUrl(url);
          if (urlNo === 1) {
            task.iframeUrl1 = url;
            this.safeIframeUrl1.next(safeResourceUrl);
          } else {
            task.iframeUrl2 = url;
            this.safeIframeUrl2.next(safeResourceUrl);
          }
        }
      });
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    TranslateModule,
    MatDividerModule,
    MatButtonModule,
    FlexModule,
  ],
  declarations: [IframePrototypeComponent],
  exports: [IframePrototypeComponent],
})
export class IframePrototypeModule {}
