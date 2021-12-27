import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ProjectStatus {
  OPEN = 'open',
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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.OPEN })
  status: ProjectStatus;

  @Column('uuid')
  userId: string;
}
