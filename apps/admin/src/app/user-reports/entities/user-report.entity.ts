import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum UserReportStatus {
  Open = 'open',
  Resolved = 'resolved',
}

export enum UserReportAction {
  None = 'none',
  FeedbackDisabled = 'feedbackDisabled',
  FeedbackEnabled = 'feedbackEnabled',
}

@Entity()
export class UserReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  dateCreated: Date;

  @Column({
    type: 'enum',
    enum: UserReportStatus,
  })
  reportStatus: UserReportStatus;

  @Column({
    type: 'enum',
    enum: UserReportAction,
    default: UserReportAction.None,
  })
  reportAction: UserReportAction;

  @Column('uuid')
  feedbackId: string;

  @Column('uuid')
  projectId: string;

  @Column('uuid')
  taskId: string;

  @Column('uuid')
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'reportedUserId' })
  reportedUserId: string;

  @Column('uuid')
  @ManyToOne(() => User)
  @JoinColumn({ name: 'reporterId' })
  reporterId: string;
}
