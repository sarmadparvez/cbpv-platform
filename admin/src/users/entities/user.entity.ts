import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Skill } from '../../skills/entities/skill.entity';
import { Country } from '../../countries/entities/country.entity';
import { Min } from 'class-validator';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  username: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({ type: 'date' })
  birthDate: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Min(0)
  @Column()
  experience: number;

  @ManyToOne(() => Country, { eager: true })
  country: Country;

  @ManyToMany(() => Skill, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  skills: Skill[];
}
