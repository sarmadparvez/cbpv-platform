import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { Answer } from './answer.entity';

export enum PaymentStatus {
  Pending = 'pending',
  Completed = 'completed',
}

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  dateCreated: Date;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.Pending })
  paymentStatus: PaymentStatus;

  @Column({ nullable: true })
  feedbackRating: number;

  @Column({ type: 'text', nullable: true })
  feedbackRatingComment: string;

  @Column({ nullable: true })
  taskRating: number;

  @Column({ type: 'text', nullable: true })
  taskRatingComment: string;

  @Column('uuid')
  @ManyToOne(() => Task)
  @JoinColumn({ name: 'taskId' })
  taskId: string;

  @ManyToOne(() => Task, (task) => task.feedbacks)
  task: Task;

  @Column('uuid')
  userId: string;

  @OneToMany(() => Answer, (answer) => answer.feedbackId, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  answers: Answer[];
}
