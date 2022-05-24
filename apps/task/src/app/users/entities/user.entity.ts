import { Country } from '../../countries/entities/country.entity';
import { Skill } from '../../skills/entities/skill.entity';

export enum Role {
  Admin = 'admin',
  Developer = 'developer',
  Crowdworker = 'crowdworker',
}

export class User {
  id: string;
  username: string;
  roles: Role[];
  birthDate: Date;
  experience: number;
  country: Country;
  skills: Skill[];
}
