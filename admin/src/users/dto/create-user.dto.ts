import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  Min,
  MinLength,
} from 'class-validator';
import { Country } from '../../countries/entities/country.entity';
import { Skill } from '../../skills/entities/skill.entity';
import { Gender } from '../entities/user.entity';
import { Exclude } from 'class-transformer';

/**
 * Password regex rules:
 * at-least one digit
 * at-lest one lower and upper case character
 * At-least 8 characters
 */
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
const PASSWORD_REGX_MSG =
  'Password should be at-least 8 characters long, must contain one lower case and one upper case letter, and one digit.';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Matches(PASSWORD_REGEX, { message: PASSWORD_REGX_MSG })
  password: string;

  @IsString()
  @IsNotEmpty()
  birthDate: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  experience: number;

  @IsUUID()
  @IsNotEmpty()
  country: string;

  @IsArray()
  @IsUUID('all', { each: true })
  @IsNotEmpty()
  skills: string[];
}
