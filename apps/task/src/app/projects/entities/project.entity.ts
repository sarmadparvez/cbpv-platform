import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ProjectStatus {
  Open = 'open',
  Closed = 'closed',
}

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  dateCreated: Date;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.Open })
  status: ProjectStatus;

  @Column('uuid')
  userId: string;

  public constructor(init?: Partial<Project>) {
    Object.assign(this, init);
  }
}
