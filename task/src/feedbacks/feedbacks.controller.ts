import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { ApiTags } from '@nestjs/swagger';
import { FindAllFeedbackDto } from './dto/findAll-feedback.dto';
import { ForbiddenError } from '@casl/ability';
import { Action } from '../iam/policy';
import { Feedback } from './entities/feedback.entity';
import * as contextService from 'request-context';

@ApiTags('feedbacks')
@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  /**
   * Create a new Feedback. The user must have Create permission for Feedback.
   */
  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    // check if user have permission to create Feedback
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Create,
      Feedback,
    );
    return this.feedbacksService.create(createFeedbackDto);
  }

  /**
   * Get a list of all Feedbacks. The user must have permission to Read all Feedbacks.
   */
  @Get()
  findAll(@Query() query?: FindAllFeedbackDto) {
    // check if user have permission to list Feedback
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Read,
      new Feedback(),
    );
    return this.feedbacksService.findAll(query);
  }

  /**
   * Get a Feedback.
   * The calling user must have Read permission on the Feedback.
   * The Read permission for the Feedback is granted if one of the following holds:
   * 1. The feedback is created by the User.
   * 2. User have Read permission the Task to which this Feedback belongs.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedbacksService.findOne(id);
  }

  /**
   * Update a Feedback. The calling user must have Update permission on the Feedback.
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    return this.feedbacksService.update(id, updateFeedbackDto);
  }

  /**
   * Delete a Feedback. The calling user must have Delete permission on the Feedback.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedbacksService.remove(id);
  }
}
