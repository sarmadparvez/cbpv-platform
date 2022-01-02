import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { classToPlain, plainToClass } from 'class-transformer';
import { Feedback } from './entities/feedback.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { FindAllFeedbackDto } from './dto/findAll-feedback.dto';
import { findWithPermissionCheck } from '../iam/utils';
import { Action, AppAbility } from '../iam/policy';
import * as contextService from 'request-context';
import { Task } from '../tasks/entities/task.entity';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  create(createFeedbackDto: CreateFeedbackDto) {
    const feedback = feedbackDtoToEntity(createFeedbackDto);
    feedback.userId = contextService.get('user').id;
    return this.feedbackRepository.save(feedback);
  }

  findAll(query?: FindAllFeedbackDto) {
    const options: FindManyOptions = {};
    if (query && query.taskId) {
      options.where = {
        taskId: query.taskId,
      };
    }
    return this.feedbackRepository.find(options);
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
}

function feedbackDtoToEntity(
  dto: CreateFeedbackDto | UpdateFeedbackDto,
): Feedback {
  const data = classToPlain(dto);
  return plainToClass(Feedback, data);
}
