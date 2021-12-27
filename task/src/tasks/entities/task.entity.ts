import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Max, Min } from 'class-validator';
import { Project } from '../../projects/entities/project.entity';
import { Image } from './image.entity';
import { Skill } from '../../skills/entities/skill.entity';
import { Country } from '../../countries/entities/country.entity';
import { Question } from './question.entity';

export enum TestType {
  BASIC = 'basic',
  SPLIT = 'split',
}

export enum PrototypeFormat {
  IMAGE = 'image',
  IFRAME = 'iframe',
}

export enum TaskStatus {
  DRAFT = 'draft',
  OPEN = 'open',
  Closed = 'closed',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;

  @Column({ type: 'enum', enum: TestType })
  testType: TestType;

  @Column({
    type: 'enum',
    enum: PrototypeFormat,
  })
  prototypeFormat: PrototypeFormat;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.DRAFT })
  status: TaskStatus;

  @Column({ type: 'text', nullable: true })
  iframeUrl1: string;

  @Column({ type: 'text', nullable: true })
  iframeUrl2: string;

  @Min(14)
  @Column({ default: 14 })
  minAge: number;

  @Max(67)
  @Column({ default: 67 })
  maxAge: number;

  @Min(0)
  @Column({ default: 0 })
  minExperience: number;

  @Min(0)
  @Max(67)
  @Column({ default: 67 })
  maxExperience: number;

  @Column('decimal')
  budget: number;

  @Column('decimal')
  incentive: number;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  @ManyToOne(() => Project)
  @JoinColumn({ name: 'projectId' })
  projectId: string;

  @OneToMany(() => Image, (image) => image.task, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  images: Image[];

  @ManyToMany(() => Skill, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  skills: Skill[];

  @ManyToMany(() => Country, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  countries: Country[];

  @OneToMany(() => Question, (question) => question.task, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  questions: Question[];
}
