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
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';
import { Action } from '../iam/policy';
import { ForbiddenError } from '@casl/ability';
import * as contextService from 'request-context';
import { User } from './entities/user.entity';
import { CreateWithSSODto } from './dto/create-with-sso.dto';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a new user with username and password.
   */
  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Create a new user with single sign on provider profile id. In this case username and password is not required.
   */
  @Public()
  @Post('createWithSSO')
  createWithSSO(@Body() createWithSSODto: CreateWithSSODto) {
    return this.usersService.createWithSSO(createWithSSODto);
  }

  /**
   * Get all the Users in the System. The calling user must have Read permission for all Users.
   */
  @ApiBearerAuth()
  @Get()
  findAll() {
    // check permissions first
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Read,
      new User(),
    ); // if user can read empty user, it can read any user

    return this.usersService.findAll();
  }

  /**
   * Get a User by ID. The calling user must have Read permission for the User.
   */
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    // check permissions
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Read,
      new User({ id }),
    );
    return this.usersService.findOne(id);
  }

  /**
   * Update a user. The calling user must have Update permission for the User.
   */
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // check permissions
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Update,
      new User({ id }),
    );
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Delete a user. The calling user must have Delete permission for the User.
   */
  @ApiBearerAuth()
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
