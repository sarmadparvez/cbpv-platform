import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { classToPlain, plainToClass } from 'class-transformer';
import { User } from './entities/user.entity';
import { Skill } from '../skills/entities/skill.entity';
import { Country } from '../countries/entities/country.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = userDtoToEntity(createUserDto);
    if (createUserDto.skills) {
      // add skills relationship
      user.skills = createUserDto.skills.map((id) => <Skill>{ id });
    }
    if (createUserDto.country) {
      // add country relationship
      user.country = <Country>{ id: createUserDto.country };
    }
    // hash password
    const salt = bcrypt.genSalt();
    user.passwordHash = await bcrypt.hash(
      createUserDto.password,
      await bcrypt.genSalt(),
    );
    return this.userRepository.save(user);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

function userDtoToEntity(dto: CreateUserDto | UpdateUserDto): User {
  const data = classToPlain(dto);
  return plainToClass(User, data);
}
