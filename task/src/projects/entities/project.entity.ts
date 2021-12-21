import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ProjectStatus {
  OPEN = 'open',
  Closed = 'closed',
}

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;

  @Column('text')
  description: string;

  @Column('timestamp')
  date_created: Date;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.OPEN })
  status: ProjectStatus;

  @Column('uuid')
  assigned_user_id: string;
}
