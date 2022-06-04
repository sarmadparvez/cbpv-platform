import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';

export enum TaskRequestStatus {
  Accepted = 'accepted',
  Requested = 'requested',
  Rejected = 'rejected',
}

/**
 * A Task request belongs to a Task. Crowd-Workers request for tasks.
 */
@Entity()
export class TaskRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  dateCreated: Date;

  @Column({ type: 'text', nullable: true })
  requestComment: string;

  @Column({ type: 'text', nullable: true })
  rejectionComment: string;

  @Column({ type: 'text', nullable: true })
  ndaUrl: string;

  @Column({ type: 'text', nullable: true })
  ndaCloudId: string;

  @Column({
    type: 'enum',
    enum: TaskRequestStatus,
  })
  requestStatus: TaskRequestStatus;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  @ManyToOne(() => Task, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'taskId' })
  taskId: string;
}
