import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Min } from 'class-validator';
import { Task } from './task.entity';

export enum QuestionType {
  TEXT = 'text',
  RADIO = 'radio',
  STAR_RATING = 'star-rating',
  THUMBS_RATING = 'thumbs-rating',
}

/**
 * A Question belongs to a Task. Questions are created by /tasks POST and PATCH endpoints.
 */
@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: QuestionType })
  type: QuestionType;

  @Column()
  @Min(1)
  order: number;

  @Column('varchar', { array: true, nullable: true })
  radioOptions: string[];

  @ManyToOne(() => Task, (task) => task.questions, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  task: string;
}
