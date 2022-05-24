import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum SSOProvider {
  Google = 'google',
  Apple = 'apple',
}
export class CreateWithSSODto extends OmitType(CreateUserDto, [
  'username',
  'password',
] as const) {
  @IsString()
  @IsNotEmpty()
  ssoProfileId: string;

  @IsEnum(SSOProvider)
  @IsNotEmpty()
  ssoProvider: SSOProvider;
}
