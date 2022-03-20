export * from './feedbacks.service';
import { FeedbacksService } from './feedbacks.service';
export * from './iAM.service';
import { IAMService } from './iAM.service';
export * from './projects.service';
import { ProjectsService } from './projects.service';
export * from './tasks.service';
import { TasksService } from './tasks.service';
export const APIS = [FeedbacksService, IAMService, ProjectsService, TasksService];
