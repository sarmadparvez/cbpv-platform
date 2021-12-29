import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { classToPlain, plainToClass } from 'class-transformer';
import { Feedback } from './entities/feedback.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { FindAllFeedbackDto } from './dto/findAll-feedback.dto';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
  ) {}

  create(createFeedbackDto: CreateFeedbackDto) {
    const feedback = feedbackDtoToEntity(createFeedbackDto);
    // ToDo: hardcoded for now, later use current user id
    feedback.userId = '6e6ff5d0-1807-4929-bcc4-b0ae88d825f1';
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

  findOne(id: string) {
    return this.feedbackRepository.findOne(id, { relations: ['answers'] });
  }

  async update(id: string, updateFeedbackDto: UpdateFeedbackDto) {
    // first check if the record exist in database because we use .save here and
    // save will create new if it not exists, but we don't want to create new here
    // as this is an update call.
    await this.feedbackRepository.findOneOrFail(id, {
      select: ['id'],
    });
    const feedback = feedbackDtoToEntity(updateFeedbackDto);
    feedback.id = id;
    // using save instead of update here to also add/remove Answers relationship
    await this.feedbackRepository.save(feedback);
    return this.feedbackRepository.findOne(id);
  }

  remove(id: string) {
    return this.feedbackRepository.delete(id);
  }
}

function feedbackDtoToEntity(
  dto: CreateFeedbackDto | UpdateFeedbackDto,
): Feedback {
  const data = classToPlain(dto);
  return plainToClass(Feedback, data);
}
