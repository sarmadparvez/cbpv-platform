import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatSidenavModule } from "@angular/material/sidenav";
import { FlexModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  TaskFormComponent,
  TaskFormDialogData,
} from "../task-form/task-form.component";
import { MatDialog } from "@angular/material/dialog";
import {
  Project,
  ProjectsService,
  Task,
  TasksService,
} from "../../../gen/api/task";
import { firstValueFrom, ReplaySubject } from "rxjs";
import { TaskDetailModule } from "../task-detail/task-detail.component";
import StatusEnum = Task.StatusEnum;
import PrototypeFormatEnum = Task.PrototypeFormatEnum;
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ImagePrototypeModule } from "../image-prototype/image-prototype.component";
import { IframePrototypeModule } from "../iframe-prototype/iframe-prototype.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { SamplePrototypeModule } from "../sample-prototype/sample-prototype.component";
import { TextPrototypeModule } from "../text-prototype/text-prototype.component";
import { QuestionnaireModule } from "../questionnaire/questionnaire.component";
import { parseError } from "../../error/parse-error";
import { TaskFeedbacksModule } from "../task-iteration-feedbacks/task-iteration-feedbacks.component";
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from "../../template/confirmation-dialog/confirmation-dialog.component";
import { FeedbackVisualizationModule } from "../feedback-visualization/feedback-visualization.component";
const views = ["overview", "feedback", "visualization", "sample"] as const;
type View = typeof views[number];

@Component({
  selector: "app-project-builder",
  templateUrl: "./project-builder.component.html",
  styleUrls: ["./project-builder.component.scss"],
})
export class ProjectBuilderComponent {
  PrototypeFormatEnum = PrototypeFormatEnum;
  taskControl = new FormControl("");
  projectId: string;
  tasks: Task[] = [];
  task = new ReplaySubject<Task>(1);
  project!: Project;
  StatusEnum = StatusEnum;
  currentView!: View;

  constructor(
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly taskService: TasksService,
    private readonly projectService: ProjectsService,
    private readonly snackBar: MatSnackBar,
    private readonly translateService: TranslateService
  ) {
    this.projectId = this.route.snapshot.paramMap.get("projectId") || "";
    this.hanleQueryParamsChange();
    this.getProject();
    this.searchTasks();
    this.taskControl.valueChanges.subscribe((task: Task) =>
      this.task.next(task)
    );
    this.task.subscribe((task) => {
      const index = this.tasks.findIndex((t) => t.id === task.id);
      if (index > -1) {
        this.tasks[index] = task;
      }
    });
  }

  hanleQueryParamsChange() {
    this.route.queryParamMap.subscribe((value) => {
      const view = value.get("view") as View;
      if (views.includes(view)) {
        this.currentView = view;
      } else {
        this.openView("overview", true);
      }
    });
  }

  async searchTasks() {
    try {
      this.tasks = await firstValueFrom(
        this.taskService.findIterations(this.projectId)
      );
      this.taskControl.setValue(this.tasks[0]);
    } catch (err) {
      console.log("unable to get task iterations ", err);
    }
  }

  async getProject() {
    this.project = await firstValueFrom(
      this.projectService.findOne(this.projectId)
    );
  }

  async openTaskForm(edit?: boolean) {
    let task: Task = <Task>{};
    if (edit) {
      task = await firstValueFrom(this.task);
    }
    this.dialog
      .open(TaskFormComponent, {
        disableClose: true,
        width: "70vw",
        data: <TaskFormDialogData>{
          task: edit ? task : null,
          project: this.project,
        },
      })
      .afterClosed()
      .subscribe((saved: boolean) => {
        if (saved) {
          if (!edit) {
            // creation case, fetch all tasks
            this.searchTasks();
          } else {
            this.getTask(task.id);
          }
          this.getProject();
        }
      });
  }

  async getTask(taskId: string) {
    const task = await firstValueFrom(this.taskService.findOne(taskId));
    const index = this.tasks.findIndex((t) => t.id === task.id);
    if (index > -1) {
      this.tasks[index] = task;
      this.taskControl.setValue(task);
    }
  }

  routeToProjects() {
    this.router.navigate(["projects"]);
  }

  async deleteTask() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: <ConfirmationDialogData>{
        title: this.translateService.instant("note.deleteTaskConfirmTitle"),
        message: this.translateService.instant("note.deleteTaskConfirmMessage"),
      },
      width: "50vw",
    });
    dialogRef.afterClosed().subscribe(async (confirm) => {
      if (confirm) {
        const taskToDelete = await firstValueFrom(this.task);
        let message = "";
        try {
          await firstValueFrom(this.taskService.remove(taskToDelete.id));
          message = this.translateService.instant("notification.delete");
          const taskIndex = this.tasks.findIndex(
            (t) => t.id === taskToDelete.id
          );
          this.tasks.splice(taskIndex, 1);
          this.task.next(this.tasks[0]);
          this.taskControl.setValue(this.tasks[0]);
        } catch (err) {
          console.log("error deleting task ", err);
          message = this.translateService.instant("error.delete");
        } finally {
          this.snackBar.open(message, "", { duration: 3000 });
        }
      }
    });
  }

  openView(view: View, replaceUrl: boolean = false) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParamsHandling: "merge",
      queryParams: { view },
      replaceUrl,
    });
  }

  async activateTask() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: <ConfirmationDialogData>{
        title: this.translateService.instant("note.activateTaskConfirmTitle"),
        message: this.translateService.instant(
          "note.activateTaskConfirmMessage"
        ),
      },
      width: "50vw",
    });
    dialogRef.afterClosed().subscribe(async (confirm) => {
      if (confirm) {
        const task = await firstValueFrom(this.task);
        let message = this.translateService.instant("notification.activate");
        try {
          const updatedTask = await firstValueFrom(
            this.taskService.activate(task.id)
          );
          task.status = updatedTask.status;
          this.task.next(task);
        } catch (err) {
          console.log("unable to activate task ", err);
          message = this.translateService.instant("error.activate");
          const error = parseError(err);
          if (error?.message) {
            message += error.message;
          }
        } finally {
          this.snackBar.open(message, "", {
            duration: 5000,
          });
        }
      }
    });
  }

  closeTask() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: <ConfirmationDialogData>{
        title: this.translateService.instant("note.closeIterationConfirmTitle"),
        message: this.translateService.instant(
          "note.closeIterationConfirmMessage"
        ),
      },
      width: "50vw",
    });
    dialogRef.afterClosed().subscribe(async (confirm) => {
      if (confirm) {
        let message = "notification.closeIteration";
        try {
          const task = await firstValueFrom(this.task);
          await firstValueFrom(this.taskService.close(task.id));
          task.status = Task.StatusEnum.Closed;
          this.task.next(task);
        } catch (err) {
          message = "error.closeIteration";
          console.log("failed closing task", err);
        } finally {
          this.snackBar.open(this.translateService.instant(message), "", {
            duration: 5000,
          });
        }
      }
    });
  }

  downloadNDA() {
    if (this.project.ndaUrl) {
      window.open(this.project.ndaUrl, "_blank");
    }
  }
}

/**
 * Project module
 * */
@NgModule({
  declarations: [ProjectBuilderComponent],
  imports: [
    CommonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatSidenavModule,
    FlexModule,
    MatButtonModule,
    TranslateModule,
    TaskDetailModule,
    MatMenuModule,
    MatIconModule,
    ImagePrototypeModule,
    IframePrototypeModule,
    MatTooltipModule,
    SamplePrototypeModule,
    TextPrototypeModule,
    QuestionnaireModule,
    TaskFeedbacksModule,
    FeedbackVisualizationModule,
  ],
})
export class ProjectBuilderModule {}
