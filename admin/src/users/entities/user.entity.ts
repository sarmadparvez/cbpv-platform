import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Skill } from '../../skills/entities/skill.entity';
import { Country } from '../../countries/entities/country.entity';
import { Min } from 'class-validator';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum Role {
  Admin = 'admin',
  Developer = 'developer',
  Crowdworker = 'crowdworker',
}

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

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Min(0)
  @Column()
  experience: number;

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
