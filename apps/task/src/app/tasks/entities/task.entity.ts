import {
  Column,
  CreateDateColumn,
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
import { Question } from './question.entity';
import { Feedback } from '../../feedbacks/entities/feedback.entity';
import { Skill } from '@cbpv-platform/skills';
import { Country } from '@cbpv-platform/countries';

export enum TestType {
  Basic = 'basic',
  Comparison = 'comparison',
  Split = 'split',
}

export enum PrototypeFormat {
  Image = 'image',
  Iframe = 'iframe',
  Text = 'text',
}

export enum TaskStatus {
  Draft = 'draft',
  Open = 'open',
  Closed = 'closed',
}

export enum AccessType {
  Open = 'open',
  Nda = 'nda',
  Request = 'request',
}

// Typeorm return decimal values as string. Here is the workaround for that.
// This solution is copied from https://stackoverflow.com/questions/69872250/typeorm-decimal-column-values-returned-as-strings-instead-of-decimal-numbers
export class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  dateCreated: Date;

  @Column({ type: 'enum', enum: TestType })
  testType: TestType;

  @Column({
    type: 'enum',
    enum: PrototypeFormat,
  })
  prototypeFormat: PrototypeFormat;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.Draft })
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: AccessType,
    default: AccessType.Open,
  })
  accessType: AccessType;

  @Column({ type: 'text', nullable: true })
  iframeUrl1: string;

  @Column({ type: 'text', nullable: true })
  iframeUrl2: string;

  @Column({ type: 'text', nullable: true })
  textualDescription1: string;

  @Column({ type: 'text', nullable: true })
  textualDescription2: string;

  @Min(18)
  @Max(67)
  @Column({ nullable: true })
  minAge: number;

  @Min(18)
  @Max(67)
  @Column({ nullable: true })
  maxAge: number;

  @Min(0)
  @Max(49)
  @Column({ nullable: true })
  minExperience: number;

  @Min(0)
  @Max(49)
  @Column({ nullable: true })
  maxExperience: number;

  @Column('decimal', {
    transformer: new ColumnNumericTransformer(),
  })
  budget: number;

  @Column('decimal', {
    transformer: new ColumnNumericTransformer(),
  })
  incentive: number;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  @ManyToOne(() => Project, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  projectId: string;

  @OneToMany(() => Image, (image) => image.taskId, {
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

  @OneToMany(() => Question, (question) => question.taskId, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  questions: Question[];

  @OneToMany(() => Feedback, (feedback) => feedback.taskId)
  feedbacks: Feedback[];

  public constructor(init?: Partial<Task>) {
    Object.assign(this, init);
  }
}
