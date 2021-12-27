import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Task, TestType } from './task.entity';

export enum SplitNumber {
  ONE = 1,
  TWO = 2,
}

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;

  @Column({ type: 'enum', enum: SplitNumber, nullable: true })
  splitNumber: SplitNumber;

  @ManyToOne(() => Task, (task) => task.images)
  task: string;
}
