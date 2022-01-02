import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  Min,
  MinLength,
} from 'class-validator';
import { Gender, Role } from '../entities/user.entity';

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

  @IsDateString()
  @IsNotEmpty()
  birthDate: Date;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  experience: number;

  @IsArray()
  @IsEnum(Role, { each: true })
  @IsNotEmpty()
  roles: Role[];

  @IsUUID()
  @IsNotEmpty()
  country: string;

  @IsArray()
  @IsUUID('all', { each: true })
  @IsNotEmpty()
  @ArrayNotEmpty()
  skills: string[];
}
