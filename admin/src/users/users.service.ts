import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { classToPlain, plainToClass } from 'class-transformer';
import { User } from './entities/user.entity';
import { Skill } from '../skills/entities/skill.entity';
import { Country } from '../countries/entities/country.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = userDtoToEntity(createUserDto);
    console.log('user ', user);
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
    const savedUser = await this.userRepository.save(user, { reload: true });
    delete savedUser['password'];
    return savedUser;
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: string) {
    return this.userRepository.findOneOrFail(id);
  }

  findByUsername(username: string) {
    return this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return this.userRepository.delete(id);
  }
}

function userDtoToEntity(dto: CreateUserDto | UpdateUserDto): User {
  const data = classToPlain(dto);
  return plainToClass(User, data);
}
