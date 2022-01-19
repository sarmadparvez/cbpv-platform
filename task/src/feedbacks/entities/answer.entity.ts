import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Max, Min } from 'class-validator';
import { Feedback } from './feedback.entity';
import { Question } from '../../tasks/entities/question.entity';

export enum ThumbsRating {
  Up = 'up',
  Down = 'down',
}

/**
 * An Answer belongs to a Feedback. Answers are created by /feedbacks POST and PATCH endpoints.
 */
@Entity()
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  textAnswer: string;

  @Column({ nullable: true })
  radioAnswer: string;

  @Column({ nullable: true })
  @Min(1)
  @Max(5)
  starRatingAnswer: number;

  @Column({ type: 'enum', enum: ThumbsRating, nullable: true })
  thumbsRatingAnswer: ThumbsRating;

  @ManyToOne(() => Feedback, (feedback) => feedback.answers, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'feedbackId' })
  feedbackId: string;

  @Column('uuid')
  @ManyToOne(() => Question)
  @JoinColumn({ name: 'questionId' })
  questionId: string;
}
