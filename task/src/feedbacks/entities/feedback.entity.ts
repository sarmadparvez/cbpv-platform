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
  PENDING = 'pending',
  COMPLETED = 'completed',
}

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  dateCreated: Date;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Column('uuid')
  @ManyToOne(() => Task)
  @JoinColumn({ name: 'taskId' })
  taskId: string;

  @Column('uuid')
  userId: string;

  @OneToMany(() => Answer, (answer) => answer.feedback, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  answers: Answer[];
}
