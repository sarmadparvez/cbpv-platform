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
    user.passwordHash = await bcrypt.hash(
      createUserDto.password,
      await bcrypt.genSalt(),
    );
    const savedUser = await this.userRepository.save(user);
    // re-retrieve the user here so that password is removed from savedUser which was added to it when converting dto to entity
    return this.userRepository.findOne(savedUser.id);
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    // first check if the record exist in database because we use .save here and
    // save will create new if it not exists, but we don't want to create new here
    // as this is an update call.
    await this.userRepository.findOneOrFail(id, {
      select: ['id'],
    });

    const user = userDtoToEntity(updateUserDto);
    if (updateUserDto.skills) {
      // update skills relationship
      user.skills = updateUserDto.skills.map((id) => <Skill>{ id });
    }
    if (updateUserDto.country) {
      // update country relationship
      user.country = <Country>{ id: updateUserDto.country };
    }
    if (updateUserDto.password) {
      // hash password
      user.passwordHash = await bcrypt.hash(
        updateUserDto.password,
        await bcrypt.genSalt(),
      );
    }
    // using save instead of update here to also add/remove the relationships
    user.id = id;
    await this.userRepository.save(user);
    return this.userRepository.findOne(id);
  }

  remove(id: string) {
    return this.userRepository.delete(id);
  }
}

function userDtoToEntity(dto: CreateUserDto | UpdateUserDto): User {
  const data = classToPlain(dto);
  return plainToClass(User, data);
}
