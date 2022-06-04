import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Min } from 'class-validator';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Country } from '@cbpv-platform/countries';
import { Skill } from '@cbpv-platform/skills';
import { Role } from '@cbpv-platform/roles';

export enum Gender {
  Male = 'male',
  Female = 'female',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  googleId: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  dateCreated: Date;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @ApiProperty({
    required: false,
  })
  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ nullable: true })
  @ApiProperty({
    required: false,
  })
  @Exclude()
  passwordHash: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Min(0)
  @Column({ nullable: true })
  experience: number;

  @Column({ type: 'boolean', default: false })
  feedbackDisabled: boolean;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
  })
  roles: Role[];

  @ManyToOne(() => Country, { eager: true })
  country: Country;

  @ManyToMany(() => Skill, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  skills: Skill[];

  public constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}
