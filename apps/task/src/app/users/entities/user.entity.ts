import { Country } from '@cbpv-platform/countries';
import { Skill } from '@cbpv-platform/skills';
import { Role } from '@cbpv-platform/roles';

export class User {
  id: string;
  username: string;
  roles: Role[];
  birthDate: Date;
  experience: number;
  country: Country;
  skills: Skill[];
}
