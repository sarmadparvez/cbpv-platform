import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Feedback, FeedbacksService } from '../../../../gen/api/task';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NoDataModule } from '../../template/no-data/no-data.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.scss'],
})
export class FeedbacksComponent implements OnInit {
  dataSource: MatTableDataSource<Feedback>;
  displayedColumns: string[] = [
    'task',
    'prototypeFormat',
    'comment',
    'dateCreated',
    'paymentStatus',
    'options',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private readonly feedbackService: FeedbacksService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    Window['fcself'] = this;
  }

  async findFeedbacks() {
    const feedbacks = await firstValueFrom(this.feedbackService.searchAll());
    this.dataSource = new MatTableDataSource(feedbacks);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openFeedback($event: MouseEvent, feedback: string) {
    event.preventDefault();
    this.router.navigate([feedback], {
      relativeTo: this.route,
    });
  }

  ngOnInit(): void {
    this.findFeedbacks();
  }
}
@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    TranslateModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    NoDataModule,
    MatTooltipModule,
  ],
  declarations: [FeedbacksComponent],
})
export class FeedbacksModule {}
