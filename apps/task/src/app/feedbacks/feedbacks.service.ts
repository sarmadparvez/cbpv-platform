import { HttpException, HttpStatus, Injectable, Patch } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { classToPlain, plainToClass } from 'class-transformer';
import { Feedback, PaymentStatus } from './entities/feedback.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { FindAllFeedbackDto } from './dto/findAll-feedback.dto';
import { findWithPermissionCheck } from '../iam/utils';
import { Action, AppAbility } from '../iam/policy';
import * as contextService from 'request-context';
import { Task } from '../tasks/entities/task.entity';
import { RateFeedbackDto } from './dto/rate-feedback.dto';
import { RateTaskDto } from './dto/rate-task.dto';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto) {
    // Check if user have already provided feedback for this task, fail in that case.
    // The feedback for a Task iteration can only be provided once.
    const existingFeedback = await this.feedbackRepository.findOne({
      where: {
        taskId: createFeedbackDto.taskId,
        userId: contextService.get('user').id,
      },
    });
    if (existingFeedback) {
      // user have already provided feedback for this Task
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          error: 'You have already provided feedback on this task.',
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    // check if Answers belong to the questions of the Task
    const task = await this.taskRepository.findOneOrFail(
      createFeedbackDto.taskId,
      {
        select: ['id'],
        relations: ['questions'],
      },
    );
    const taskQuestionIds = task.questions.map((question) => question.id);
    const allAnswersBelongToTaskQuesitons = createFeedbackDto.answers.every(
      (answer) => taskQuestionIds.includes(answer.questionId),
    );

    if (!allAnswersBelongToTaskQuesitons) {
      // There exist atleast one answer which does not belong to the Task Questions
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          error: 'The answers does not belong to task questions.',
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    const feedback = feedbackDtoToEntity(createFeedbackDto);
    feedback.userId = contextService.get('user').id;
    return this.feedbackRepository.save(feedback);
  }

  findAll(query?: FindAllFeedbackDto) {
    const options: FindManyOptions = {
      relations: ['task'],
    };
    if (query && query.taskId) {
      options.where = {
        taskId: query.taskId,
      };
    }
    return this.feedbackRepository.find(options);
  }

  async findFeedbacks(taskId: string) {
    // Check if user have Read permission for the Task
    await findWithPermissionCheck(taskId, Action.Read, this.taskRepository);
    return this.feedbackRepository.find({
      where: {
        taskId,
      },
    });
  }

  async findOne(id: string) {
    const feedback = await this.feedbackRepository.findOneOrFail(id, {
      relations: ['answers'],
    });

    const ability = contextService.get('userAbility') as AppAbility;
    if (ability.can(Action.Read, feedback)) {
      return feedback;
    } else {
      // User implicitly have Read permission on Feedback if the user have Read permission on the Task to which this feedback belongs.
      await findWithPermissionCheck(
        feedback.taskId,
        Action.Read,
        this.taskRepository,
      );
      return feedback;
    }
  }

  async update(id: string, updateFeedbackDto: UpdateFeedbackDto) {
    // first check if the record exist in database because we use .save here and
    // save will create new if it not exists, but we don't want to create new here
    // as this is an update call.
    await findWithPermissionCheck(id, Action.Update, this.feedbackRepository);
    const feedback = feedbackDtoToEntity(updateFeedbackDto);
    feedback.id = id;
    // using save instead of update here to also add/remove Answers relationship
    await this.feedbackRepository.save(feedback);
    return this.feedbackRepository.findOne(id);
  }

  async remove(id: string) {
    await findWithPermissionCheck(id, Action.Delete, this.feedbackRepository);
    return this.feedbackRepository.delete(id);
  }

  searchAll() {
    return this.feedbackRepository.find({
      where: {
        userId: contextService.get('user')?.id,
      },
      relations: ['task'],
    });
  }

  async releasePayment(id: string) {
    const feedback = await this.feedbackRepository.findOneOrFail(id, {
      select: ['id', 'taskId', 'paymentStatus'],
    });
    // Check if user have Update permission on the Task for which the payment is to be released.
    await findWithPermissionCheck(
      feedback.taskId,
      Action.Update,
      this.taskRepository,
    );

    if (feedback.paymentStatus === PaymentStatus.Completed) {
      // Payment already completed
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          error: 'Payment for the Feedback is already completed.',
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    return this.feedbackRepository.update(id, {
      paymentStatus: PaymentStatus.Completed,
    });
  }

  async rateFeedback(id: string, rateFeedbackDto: RateFeedbackDto) {
    const feedback = await this.feedbackRepository.findOneOrFail(id, {
      select: ['id', 'taskId'],
    });
    // Check if user have Update permission on the Task for which the rating is to be given.
    await findWithPermissionCheck(
      feedback.taskId,
      Action.Update,
      this.taskRepository,
    );

    const updatedFeedback = feedbackDtoToEntity(rateFeedbackDto);
    updatedFeedback.id = id;
    return this.feedbackRepository.save(updatedFeedback);
  }

  async rateTask(feedbackId: string, rateTaskDto: RateTaskDto) {
    // Check if user have Read permission on the Feedback
    await findWithPermissionCheck(
      feedbackId,
      Action.Read,
      this.feedbackRepository,
    );

    const updatedFeedback = feedbackDtoToEntity(rateTaskDto);
    updatedFeedback.id = feedbackId;
    return this.feedbackRepository.save(updatedFeedback);
  }
}

function feedbackDtoToEntity(
  dto: CreateFeedbackDto | UpdateFeedbackDto | RateFeedbackDto | RateTaskDto,
): Feedback {
  const data = classToPlain(dto);
  return plainToClass(Feedback, data);
}
