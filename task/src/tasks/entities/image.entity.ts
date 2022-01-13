import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { Max, Min } from 'class-validator';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;

  @Min(1)
  @Max(2)
  @Column({ default: 1 })
  splitNumber: number;

  @ManyToOne(() => Task, (task) => task.images, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'taskId' })
  taskId: string;

  @Column()
  cloudId: string;

  public constructor(init?: Partial<Image>) {
    Object.assign(this, init);
  }
}
