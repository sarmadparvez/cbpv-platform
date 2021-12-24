import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { classToPlain, plainToClass } from 'class-transformer';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  create(createProjectDto: CreateProjectDto) {
    // ToDo: hardcoded for now, later use current user id
    createProjectDto.assignedUserId = '6e6ff5d0-1807-4929-bcc4-b0ae88d825f1';
    const project = projectDtoEntity(createProjectDto);
    return this.projectRepository.save(project);
  }

  findAll() {
    return this.projectRepository.find();
  }

  findOne(id: string) {
    return this.projectRepository.findOne(id);
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = projectDtoEntity(updateProjectDto);
    await this.projectRepository.update(id, project);
    return this.projectRepository.findOne(id);
  }

  remove(id: string) {
    return this.projectRepository.delete(id);
  }
}
export function projectDtoEntity(
  dto: CreateProjectDto | UpdateProjectDto,
): Project {
  const data = classToPlain(dto);
  return plainToClass(Project, data);
}
