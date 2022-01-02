import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';
import { Action, defineAbilityFor } from '../iam/policy';
import { ForbiddenError, subject } from '@casl/ability';
import * as contextService from 'request-context';
import { User } from './entities/user.entity';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    // check permissions first
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Read,
      new User(),
    ); // if user can read empty user, it can read any user

    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // check permissions
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Read,
      new User({ id }),
    );
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // check permissions
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Update,
      new User({ id }),
    );
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // check permissions
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Delete,
      new User({ id }),
    );
    return this.usersService.remove(id);
  }
}
