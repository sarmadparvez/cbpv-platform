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

  @CreateDateColumn({ type: 'timestamp with time zone' })
  dateCreated: Date;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  passwordHash: string;

  @Column({ type: 'date' })
  birthDate: string;

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