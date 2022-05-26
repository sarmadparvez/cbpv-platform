import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { FindAllFeedbackDto } from './dto/findAll-feedback.dto';
import { ForbiddenError } from '@casl/ability';
import { Action } from '../iam/policy';
import { Feedback } from './entities/feedback.entity';
import * as contextService from 'request-context';
import { RateFeedbackDto } from './dto/rate-feedback.dto';
import { RateTaskDto } from './dto/rate-task.dto';

@ApiTags('feedbacks')
@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  /**
   * Create a new Feedback. The user must have Create permission for Feedback.
   */
  @ApiBearerAuth()
  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    // check if user have permission to create Feedback
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Create,
      Feedback
    );
    return this.feedbacksService.create(createFeedbackDto);
  }

  /**
   * Get a list of all Feedbacks. The user must have permission to Read all Feedbacks.
   */
  @ApiBearerAuth()
  @Get()
  findAll(@Query() query?: FindAllFeedbackDto) {
    // check if user have permission to list Feedback
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Read,
      new Feedback()
    );
    return this.feedbacksService.findAll(query);
  }

  /**
   * Get a list of Feedbacks on which the calling user have access to.
   * The user must have Read permission on the Feedbacks.
   */
  @ApiBearerAuth()
  @Get('search')
  searchAll() {
    // check if user have permission to read Feedbacks
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Read,
      Feedback
    );
    return this.feedbacksService.searchAll();
  }

  /**
   * Get all Feedbacks for a Task. The user must have Read permission on the Task.
   */
  @ApiBearerAuth()
  @Get('tasks/:taskId')
  @ApiParam({
    name: 'taskId',
    description: 'The task id to list Feedbacks for',
  })
  findFeedbacks(@Param('taskId') taskId: string) {
    return this.feedbacksService.findFeedbacks(taskId);
  }

  /**
   * Get a Feedback.
   * The calling user must have Read permission on the Feedback.
   * The Read permission for the Feedback is granted if one of the following holds:
   * 1. The feedback is created by the User.
   * 2. User have Read permission on the Task to which this Feedback belongs.
   */
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedbacksService.findOne(id);
  }

  /**
   * Update a Feedback. The calling user must have Update permission on the Feedback.
   */
  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto
  ) {
    return this.feedbacksService.update(id, updateFeedbackDto);
  }

  /**
   * Release payment for the Feedback. User must have Update Permission on the Task related to Feedback.
   */
  @ApiBearerAuth()
  @Put(':id/release-payment')
  releasePayment(@Param('id') id: string) {
    return this.feedbacksService.releasePayment(id);
  }

  /**
   * Rate a feedback. User must have Update Permission on the Task related to Feedback.
   */
  @ApiBearerAuth()
  @Patch(':id/rate-feedback')
  rateFeedback(
    @Param('id') id: string,
    @Body() rateFeedbackDto: RateFeedbackDto
  ) {
    return this.feedbacksService.rateFeedback(id, rateFeedbackDto);
  }

  /**
   * Rate a Task related to feedback. User must have Read Permission on the Feedback.
   */
  @ApiBearerAuth()
  @Patch(':id/rate-task')
  rateTask(@Param('id') id: string, @Body() rateTaskDto: RateTaskDto) {
    return this.feedbacksService.rateTask(id, rateTaskDto);
  }

  /**
   * Delete a Feedback. The calling user must have Delete permission on the Feedback.
   */
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedbacksService.remove(id);
  }
}
