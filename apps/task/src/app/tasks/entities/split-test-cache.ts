import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Task } from './task.entity';
import { Max, Min } from 'class-validator';

/**
 * This cache stores which user will lie in which half of the split.
 */
@Entity()
export class SplitTestCache {
  @PrimaryColumn('uuid')
  userId: string;

  @PrimaryColumn('uuid')
  @ManyToOne(() => Task, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'taskId' })
  taskId: string;

  @Min(1)
  @Max(2)
  @Column({ nullable: true })
  prototypeNumber: number; // In case of split test, which prototype number feedback will be given on.
}
