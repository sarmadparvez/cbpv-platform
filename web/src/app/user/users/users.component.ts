import { Component, NgModule, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, UsersService } from '../../../../gen/api/admin';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoDataModule } from '../../template/no-data/no-data.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from '../../template/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]);
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'username',
    'dateCreated',
    'birthDate',
    'experience',
    'roles',
    'country',
    'skills',
    'options',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private readonly userService: UsersService,
    private readonly dialog: MatDialog,
    private readonly translateService: TranslateService,
    private readonly snackBar: MatSnackBar,
  ) {
    Window['ucself'] = this;
    this.findUsers();
  }

  async findUsers() {
    const users = await firstValueFrom(this.userService.findAll());
    this.dataSource = new MatTableDataSource(users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  deleteUser(userId: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: <ConfirmationDialogData>{
        title: this.translateService.instant('name.deleteUser'),
        message: this.translateService.instant('note.deleteUserConfirmMessage'),
      },
      width: '50vw',
    });
    dialogRef.afterClosed().subscribe(async confirm => {
      if (confirm) {
        let message = 'notification.delete';
        try {
          await firstValueFrom(this.userService.remove(userId));
          this.findUsers();
        } catch (err) {
          console.log('unable to delete user ', err);
          message = 'error.delete';
        } finally {
          this.snackBar.open(this.translateService.instant(message), '', {
            duration: 5000,
          });
        }
      }
    });
  }
}
@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    NoDataModule,
    TranslateModule,
    MatChipsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
  ],
  declarations: [UsersComponent],
})
export class UsersModule {}
